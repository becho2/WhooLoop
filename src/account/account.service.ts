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

  async refresh(userIdx: number, sectionIdx: number) {
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
    // return false;

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
      return await this.create(createAccountData);
    } else {
      const updateAccountData: UpdateAccountDto = {
        ...createAccountData,
        updated_last: now,
      };
      return await this.update(accountInfo.account_idx, updateAccountData);
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

  async findOneBySectionIdx(sectionIdx: number) {
    return await this.accountRepository.findOneBySectionIdx(sectionIdx);
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
