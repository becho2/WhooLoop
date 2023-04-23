import { Test, TestingModule } from '@nestjs/testing';
import { DBModule } from '../db/db.module';
import { TrxRepository } from './trx.repository';

describe('UserService', () => {
  let repository: TrxRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [TrxRepository],
    }).compile();

    repository = module.get<TrxRepository>(TrxRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
