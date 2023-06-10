import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './account.repository';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { WhooingAccountResponseDto } from './dto/whooing-account-response.dto';
import { OauthAccessTokenResponseDto } from '../oauth/dto/oauth-access-token-response.dto';
import { API_ACCOUNTS_URL } from '../lib/constants';
import { OauthUserRepository } from '../oauth/oauth-user.repository';
import { SectionRepository } from '../section/section.repository';

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
    const whooingAccessData: OauthAccessTokenResponseDto =
      await this.oauthUserRepository.findOne(userIdx);

    const sectionId: string = await this.sectionRepository.findOne(sectionIdx);
    const whooingAccountData: WhooingAccountResponseDto =
      await this.getWhooingAccountInfo(sectionId, whooingAccessData);
    const accountData: CreateAccountDto | UpdateAccountDto = {
      section_id: sectionId,
      assets: JSON.stringify(whooingAccountData.assets),
      liabilities: JSON.stringify(whooingAccountData.liabilities),
      capital: JSON.stringify(whooingAccountData.capital),
      income: JSON.stringify(whooingAccountData.income),
      expenses: JSON.stringify(whooingAccountData.expenses),
    };
    const accountIdx: number = (
      await this.accountRepository.findOneByWhooingSectionId(sectionId)
    ).account_idx;

    if (accountIdx === undefined) {
      return await this.create(accountData);
    } else {
      return await this.update(accountIdx, accountData);
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
    sectionIds.forEach(async (sectionId) => {
      const accountData: WhooingAccountResponseDto =
        await this.getWhooingAccountInfo(sectionId, whooingAccessData);
      const createAccountData: CreateAccountDto = {
        section_id: sectionId,
        assets: JSON.stringify(accountData.assets),
        liabilities: JSON.stringify(accountData.liabilities),
        capital: JSON.stringify(accountData.capital),
        income: JSON.stringify(accountData.income),
        expenses: JSON.stringify(accountData.expenses),
      };
      createAccountList.push(createAccountData);
    });

    return this.accountRepository.createMany(createAccountList);
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
