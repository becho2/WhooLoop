import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { DBModule } from '../lib/db/db.module';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { OauthUserRepository } from '../oauth/oauth-user.repository';
import { SectionRepository } from '../section/section.repository';
import { FrequentItemsRepository } from './frequent-items.repository';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      controllers: [AccountController],
      providers: [
        AccountService,
        AccountRepository,
        WhooingResourceApiService,
        OauthUserRepository,
        SectionRepository,
        FrequentItemsRepository,
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
