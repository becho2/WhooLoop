import { Test, TestingModule } from '@nestjs/testing';
import { OauthService } from './oauth.service';
import { DBModule } from '../lib/db/db.module';
import { OauthUserRepository } from './oauth-user.repository';
import { OauthAccessTokenResponseDto } from './dto/oauth-access-token-response.dto';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { SectionService } from '../section/section.service';
import { SectionRepository } from '../section/section.repository';

describe('OauthService', () => {
  let service: OauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule, JwtModule.register({})],
      providers: [
        OauthService,
        AuthService,
        OauthUserRepository,
        SectionService,
        SectionRepository,
      ],
    }).compile();

    service = module.get<OauthService>(OauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', () => {
    const testData: OauthAccessTokenResponseDto = {
      whooingUserId: 1,
      whooingAccessToken: 'sadfls',
      whooingAccessTokenSecret: 'asdfjs',
    };
    const rt = service.createOauthUser(testData);
    expect(rt).toBeDefined();
  });
});
