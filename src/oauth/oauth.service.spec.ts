import { Test, TestingModule } from '@nestjs/testing';
import { OauthService } from './oauth.service';
import { DBModule } from '../lib/db/db.module';
import { OauthUserRepository } from './oauth-user.repository';
import { OauthAccessTokenResponseDto } from './dto/oauth-access-token-response.dto';

describe('OauthService', () => {
  let service: OauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [OauthService, OauthUserRepository],
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
