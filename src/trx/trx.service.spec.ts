import { Test, TestingModule } from '@nestjs/testing';
import { TrxService } from './trx.service';
import { TrxRepository } from './trx.repository';
import { DBModule } from '../lib/db/db.module';

describe('TrxService', () => {
  let service: TrxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [TrxService, TrxRepository],
    }).compile();

    service = module.get<TrxService>(TrxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
