import { Test, TestingModule } from '@nestjs/testing';
import { DBModule } from '../lib/db/db.module';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { UserOracle } from './user.oracle';
import { testCreateUserDto } from '../lib/test-data';

describe('UserService', () => {
  let repository: UserOracle;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [UserOracle],
    }).compile();

    repository = module.get<UserOracle>(UserOracle);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // @TODO
  it.skip('should be created', () => {
    repository.create(testCreateUserDto);
  });
});
