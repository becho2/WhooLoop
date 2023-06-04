import { Test, TestingModule } from '@nestjs/testing';
import { DBModule } from '../lib/db/db.module';
import { TrxRepository } from './trx.repository';
import { ConfigModule } from '@nestjs/config';

describe('TrxRepository', () => {
  let repository: TrxRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DBModule,
        ConfigModule.forRoot({
          envFilePath: [
            `${__dirname}/../config/env/.${process.env.NODE_ENV}.env`,
          ],
          isGlobal: true,
        }),
      ],
      providers: [TrxRepository],
    }).compile();

    repository = module.get<TrxRepository>(TrxRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return type Array', async () => {
    const list = await repository.findAll(5);
    expect(list).toBeInstanceOf(Array);
  });

  it('should return empty list', async () => {
    const list = await repository.findAllIdxOfUser(5);
    expect(list).toEqual([]);
  });
});
