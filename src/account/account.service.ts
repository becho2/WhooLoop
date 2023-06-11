import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './account.repository';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { WhooingAccountResponseDto } from './dto/whooing-account-response.dto';
import { OauthAccessTokenResponseDto } from '../oauth/dto/oauth-access-token-response.dto';
import {
  API_ACCOUNTS_ALL_URL,
  API_FREQUENT_ITEMS_URL,
  WHOOING_FREQUENT_ITEMS_SLOT1,
} from '../lib/constants';
import { OauthUserRepository } from '../oauth/oauth-user.repository';
import { SectionRepository } from '../section/section.repository';
import { plainToInstance } from 'class-transformer';
import { AccountEntity } from './entities/account.entity';
import { getPastDateTimeByMinutes, getToday } from '../lib/helper';
import { SelectAccountOutputDto } from './dto/select-account-output.dto';
import { WhooingAccountUnitDto } from './dto/whooing-account-unit.dto';
import { WhooingFrequentItemsResponseDto } from './dto/whooing-frequent-items-response.dto';
import { CreateFrequentItemDto } from './dto/create-frequent-item.dto';
import { WhooingFrequentItemDto } from './dto/whooing-frequent-item.dto';
import { FrequentItemsRepository } from './frequent-items.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly whooingApi: WhooingResourceApiService,
    private readonly oauthUserRepository: OauthUserRepository,
    private readonly sectionRepository: SectionRepository,
    private readonly frequentItemsRepository: FrequentItemsRepository,
  ) {}

  async getWhooingAccountsInfo(
    sectionId: string,
    whooingAccessData: OauthAccessTokenResponseDto,
  ): Promise<WhooingAccountResponseDto> {
    return await this.whooingApi.resourceApiRequest(
      API_ACCOUNTS_ALL_URL + sectionId,
      whooingAccessData,
    );
  }

  async getWhooingFrequentItemsInfo(
    sectionId: string,
    whooingAccessData: OauthAccessTokenResponseDto,
  ): Promise<WhooingFrequentItemsResponseDto> {
    return await this.whooingApi.resourceApiRequest(
      API_FREQUENT_ITEMS_URL + sectionId,
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

    // 후잉에서 항목 정보 가져오기
    const whooingAccountData: WhooingAccountResponseDto =
      await this.getWhooingAccountsInfo(sectionId, whooingAccessData);

    // 후잉에서 가져온 항목 정보를 후룹 DB에 맞게 가공
    const createAccountData: CreateAccountDto = {
      section_idx: sectionIdx,
      section_id: sectionId,
      assets: JSON.stringify(whooingAccountData.assets),
      liabilities: JSON.stringify(whooingAccountData.liabilities),
      capital: JSON.stringify(whooingAccountData.capital),
      income: JSON.stringify(whooingAccountData.income),
      expenses: JSON.stringify(whooingAccountData.expenses),
    };

    // 후잉에서 자주 입력거래 정보 가져오기
    const whooingFrequentItems: WhooingFrequentItemsResponseDto =
      await this.getWhooingFrequentItemsInfo(sectionId, whooingAccessData);

    // 후잉에서 가져온 자주입력거래 정보를 후룹 DB에 맞게 가공
    const createFrequentItemDtoList: CreateFrequentItemDto[] = [];
    whooingFrequentItems.slot1?.forEach((item: WhooingFrequentItemDto) => {
      const leftTitle = this.getFrequentItemTitle(
        whooingAccountData,
        item.l_account,
        item.l_account_id,
      );
      const rightTitle = this.getFrequentItemTitle(
        whooingAccountData,
        item.r_account,
        item.r_account_id,
      );
      const createFrequentItemData: CreateFrequentItemDto = {
        section_id: sectionId,
        whooing_slot: WHOOING_FREQUENT_ITEMS_SLOT1,
        whooing_item_id: item.item_id,
        item: item.item,
        money: item.money,
        left: leftTitle,
        right: rightTitle,
      };
      createFrequentItemDtoList.push(createFrequentItemData);
    });

    if (accountInfo === undefined) {
      // 기존 정보가 없을 경우 create, 있으면 update
      if (await this.create(createAccountData)) {
        await this.frequentItemsRepository.createMany(
          createFrequentItemDtoList,
        );
        return this.findOneBySectionIdx(userIdx, sectionIdx);
      }
    } else {
      const updateAccountData: UpdateAccountDto = {
        ...createAccountData,
        updated_last: now,
      };
      if (await this.update(accountInfo.account_idx, updateAccountData)) {
        await this.frequentItemsRepository.deleteManyBySectionId(sectionId);
        await this.frequentItemsRepository.createMany(
          createFrequentItemDtoList,
        );
        return this.findOneBySectionIdx(userIdx, sectionIdx);
      }
    }
  }

  getFrequentItemTitle(
    whooingAccountData: WhooingAccountResponseDto,
    account: string,
    accountId: string,
  ) {
    let title = '';
    let index = 0;
    switch (account) {
      case 'assets':
        index = whooingAccountData.assets.findIndex(
          (v) => v.account_id === accountId,
        );
        title = whooingAccountData.assets[index].title;
        break;
      case 'liabilities':
        index = whooingAccountData.liabilities.findIndex(
          (v) => v.account_id === accountId,
        );
        title = whooingAccountData.liabilities[index].title;
        break;
      case 'capital':
        index = whooingAccountData.capital.findIndex(
          (v) => v.account_id === accountId,
        );
        title = whooingAccountData.capital[index].title;
        break;
      case 'expenses':
        index = whooingAccountData.expenses.findIndex(
          (v) => v.account_id === accountId,
        );
        title = whooingAccountData.expenses[index].title;
        break;
      case 'income':
        index = whooingAccountData.income.findIndex(
          (v) => v.account_id === accountId,
        );
        title = whooingAccountData.income[index].title;
        break;
      default:
        break;
    }

    return title;
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
        await this.getWhooingAccountsInfo(sectionId, whooingAccessData);

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
    userIdx: number,
    sectionIdx: number,
  ): Promise<SelectAccountOutputDto> {
    let accountStrings: AccountEntity | undefined;
    accountStrings = await this.accountRepository.findOneBySectionIdx(
      sectionIdx,
    );

    if (!accountStrings) {
      const sectionId: string = (
        await this.sectionRepository.findOne(sectionIdx)
      ).whooing_section_id;
      const whooingAccessData: OauthAccessTokenResponseDto = plainToInstance(
        OauthAccessTokenResponseDto,
        await this.oauthUserRepository.findOne(userIdx),
        {
          excludeExtraneousValues: true,
        },
      ); // snake_case -> camelCase

      // 항목을 검색했는데 해당 섹션에 항목 데이터가 없을 경우 후잉에서 받아와서 DB에 입력처리
      await this.createMany([sectionId], whooingAccessData);
      accountStrings = await this.accountRepository.findOneBySectionIdx(
        sectionIdx,
      );
    }

    const selectOutputDto: SelectAccountOutputDto = {
      assets: this.parseAndReturnOnlyTitlesOfAccounts(accountStrings.assets),
      liabilities: this.parseAndReturnOnlyTitlesOfAccounts(
        accountStrings.liabilities,
      ),
      capital: this.parseAndReturnOnlyTitlesOfAccounts(accountStrings.capital),
      expenses: this.parseAndReturnOnlyTitlesOfAccounts(
        accountStrings.expenses,
      ),
      income: this.parseAndReturnOnlyTitlesOfAccounts(accountStrings.income),
    };

    return selectOutputDto;
  }

  /**
   * 1. open_date가 오늘보다 예전 날짜, close_date가 오늘보다 나중 날짜
   * 2. type이 group이 아닌 값만
   * 3. title만 들어있는 Array 리턴
   */
  private parseAndReturnOnlyTitlesOfAccounts(
    accountProperty: string,
  ): string[] {
    const account = accountProperty ? JSON.parse(accountProperty) : [];

    const today = getToday();
    return account
      .filter(
        (element: WhooingAccountUnitDto) =>
          element.type !== 'group' &&
          element.open_date < +today &&
          element.close_date > +today,
      )
      .map((element: WhooingAccountUnitDto) => element.title);
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
