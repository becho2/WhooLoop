import { Test, TestingModule } from '@nestjs/testing';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { OauthUserRepository } from './oauth-user.repository';
import { DBModule } from '../lib/db/db.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { SectionService } from '../section/section.service';
import { SectionRepository } from '../section/section.repository';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { AccountService } from '../account/account.service';
import { AccountRepository } from '../account/account.repository';

describe('OauthController', () => {
  let controller: OauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule, JwtModule.register({})],
      controllers: [OauthController],
      providers: [
        OauthService,
        AuthService,
        OauthUserRepository,
        SectionService,
        SectionRepository,
        AccountService,
        AccountRepository,
        WhooingResourceApiService,
      ],
    }).compile();

    controller = module.get<OauthController>(OauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
