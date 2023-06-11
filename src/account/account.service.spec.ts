import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { DBModule } from '../lib/db/db.module';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { OauthUserRepository } from '../oauth/oauth-user.repository';
import { SectionRepository } from '../section/section.repository';
import { FrequentItemsRepository } from './frequent-items.repository';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [
        AccountService,
        AccountRepository,
        WhooingResourceApiService,
        OauthUserRepository,
        SectionRepository,
        FrequentItemsRepository,
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
