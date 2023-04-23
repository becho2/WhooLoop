import { Test, TestingModule } from '@nestjs/testing';
import { CronService } from './cron.service';
import { DBModule } from '../lib/db/db.module';
import { TrxRepository } from '../lib/repositories/trx.repository';

describe('CronService', () => {
  let service: CronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [CronService, TrxRepository],
    }).compile();

    service = module.get<CronService>(CronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
