import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './account.repository';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { WhooingAccountResponseDto } from './dto/whooing-account-response.dto';
import { OauthAccessTokenResponseDto } from '../oauth/dto/oauth-access-token-response.dto';
import { API_ACCOUNTS_URL } from '../lib/constants';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly whooingApi: WhooingResourceApiService,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    return this.accountRepository.create(createAccountDto);
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  async createMany(
    sectionIds: string[],
    whooingAccessData: OauthAccessTokenResponseDto,
  ) {
    const createAccountList: CreateAccountDto[] = [];
    sectionIds.forEach(async (sectionId) => {
      const accountData: WhooingAccountResponseDto =
        await this.whooingApi.resourceApiRequest(
          API_ACCOUNTS_URL + sectionId,
          whooingAccessData,
        );
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
