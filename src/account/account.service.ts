import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './account.repository';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { WhooingAccountResponseDto } from './dto/whooing-account-response.dto';
import { OauthAccessTokenResponseDto } from '../oauth/dto/oauth-access-token-response.dto';
import { API_ACCOUNTS_URL } from '../lib/constants';
import { OauthUserRepository } from '../oauth/oauth-user.repository';
import { SectionRepository } from '../section/section.repository';
import { plainToInstance } from 'class-transformer';
import { AccountEntity } from './entities/account.entity';
import { getPastDateTimeByMinutes } from '../lib/helper';
import { SelectAccountOutputDto } from './dto/select-account-output.dto';
import { WhooingAccountUnitDto } from './dto/whooing-account-unit.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly whooingApi: WhooingResourceApiService,
    private readonly oauthUserRepository: OauthUserRepository,
    private readonly sectionRepository: SectionRepository,
  ) {}

  async getWhooingAccountInfo(
    sectionId: string,
    whooingAccessData: OauthAccessTokenResponseDto,
  ): Promise<WhooingAccountResponseDto> {
    return await this.whooingApi.resourceApiRequest(
      API_ACCOUNTS_URL + sectionId,
      whooingAccessData,
    );
  }

  async refresh(
    userIdx: number,
    sectionIdx: number,
  ): Promise<SelectAccountOutputDto> {
    const sectionId: string = (await this.sectionRepository.findOne(sectionIdx))
      .whooing_section_id;

    const accountInfo: AccountEntity | undefined =
      await this.accountRepository.findOneByWhooingSectionId(sectionId);
    const now = new Date();
    const fiveMinutesAgo = getPastDateTimeByMinutes(5);
    if (accountInfo.updated_last > fiveMinutesAgo) {
      // 지나치게 잦은 업데이트 요청을 방지하기 위해 마지막 update가 5분도 안 지났다면 에러 리턴
      throw new BadRequestException(
        'You requested too often(please try again 5 minutes later).',
      );
    }

    const whooingAccessData: OauthAccessTokenResponseDto = plainToInstance(
      OauthAccessTokenResponseDto,
      await this.oauthUserRepository.findOne(userIdx),
      {
        excludeExtraneousValues: true,
      },
    ); // snake_case -> camelCase
    const whooingAccountData: WhooingAccountResponseDto =
      await this.getWhooingAccountInfo(sectionId, whooingAccessData);
    const createAccountData: CreateAccountDto = {
      section_idx: sectionIdx,
      section_id: sectionId,
      assets: JSON.stringify(whooingAccountData.assets),
      liabilities: JSON.stringify(whooingAccountData.liabilities),
      capital: JSON.stringify(whooingAccountData.capital),
      income: JSON.stringify(whooingAccountData.income),
      expenses: JSON.stringify(whooingAccountData.expenses),
    };

    if (accountInfo === undefined) {
      // 기존 정보가 없을 경우 create, 있으면 update
      if (await this.create(createAccountData)) {
        return this.findOneBySectionIdx(sectionIdx);
      }
    } else {
      const updateAccountData: UpdateAccountDto = {
        ...createAccountData,
        updated_last: now,
      };
      if (await this.update(accountInfo.account_idx, updateAccountData)) {
        return this.findOneBySectionIdx(sectionIdx);
      }
    }
  }

  async create(createAccountDto: CreateAccountDto) {
    return this.accountRepository.create(createAccountDto);
  }

  async update(accountIdx: number, updateAccountDto: UpdateAccountDto) {
    return this.accountRepository.update(accountIdx, updateAccountDto);
  }

  async createMany(
    sectionIds: string[],
    whooingAccessData: OauthAccessTokenResponseDto,
  ) {
    const createAccountList: CreateAccountDto[] = [];
    for (const sectionId of sectionIds) {
      const accountData: WhooingAccountResponseDto =
        await this.getWhooingAccountInfo(sectionId, whooingAccessData);

      const sectionIdx: number = (
        await this.sectionRepository.findOneByWhooingSectionId(sectionId)
      ).section_idx;
      const createAccountData: CreateAccountDto = {
        section_idx: sectionIdx,
        section_id: sectionId,
        assets: JSON.stringify(accountData.assets),
        liabilities: JSON.stringify(accountData.liabilities),
        capital: JSON.stringify(accountData.capital),
        income: JSON.stringify(accountData.income),
        expenses: JSON.stringify(accountData.expenses),
      };
      createAccountList.push(createAccountData);
    }

    return this.accountRepository.createMany(createAccountList);
  }

  async findOneBySectionIdx(
    sectionIdx: number,
  ): Promise<SelectAccountOutputDto> {
    const accountString: AccountEntity =
      await this.accountRepository.findOneBySectionIdx(sectionIdx);

    const assets = JSON.parse(accountString.assets);
    const liabilities = JSON.parse(accountString.liabilities);
    const capital = accountString.capital
      ? JSON.parse(accountString.capital)
      : [];
    const expenses = JSON.parse(accountString.expenses);
    const income = JSON.parse(accountString.income);

    const selectOutputDto: SelectAccountOutputDto = {
      assets: assets.map((asset: WhooingAccountUnitDto) => asset.title),
      liabilities: liabilities.map(
        (asset: WhooingAccountUnitDto) => asset.title,
      ),
      capital: capital.map((asset: WhooingAccountUnitDto) => asset.title),
      expenses: expenses.map((asset: WhooingAccountUnitDto) => asset.title),
      income: income.map((asset: WhooingAccountUnitDto) => asset.title),
    };

    return selectOutputDto;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
