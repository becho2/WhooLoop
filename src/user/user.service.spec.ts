import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DBModule } from '../lib/db/db.module';
import { UserRepository } from '../lib/repositories/user.repository';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
