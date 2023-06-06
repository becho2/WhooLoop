import { Test, TestingModule } from '@nestjs/testing';
import { DBModule } from '../lib/db/db.module';
import { OauthUserRepository } from './oauth-user.repository';
import { CreateOauthUserDto } from './dto/create-oauth-user.dto';

describe('WhooingUserService', () => {
  let repository: OauthUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [OauthUserRepository],
    }).compile();

    repository = module.get<OauthUserRepository>(OauthUserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it.skip('should create user', async () => {
    const testCreateUserDto: CreateOauthUserDto = {
      whooing_user_id: 1,
      whooing_access_token: 'asdfjl2jk2',
      whooing_access_token_secret: 'asdlkfjls1',
    };
    const createdUser = await repository.create(testCreateUserDto);
    expect(createdUser).toBeDefined();
  });

  it.skip('should be undefined', async () => {
    const userId = await repository.findUserIdxByWhooingUserId(1);
    expect(userId).toBeUndefined();
  });
});
