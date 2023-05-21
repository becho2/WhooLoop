import { Test, TestingModule } from '@nestjs/testing';
import { WhooingEverydayService } from './whooing-everyday.service';
import { TrxRepository } from '../trx/trx.repository';
import { DBModule } from '../lib/db/db.module';
import { WhooingInputData } from './dto/whooing-input-form.dto';
import { LogRepository } from './log.repository';
import { ViewTimeDataListEntity } from './entities/view-time-data-list.entity';

describe('WhooingEverydayService', () => {
  let service: WhooingEverydayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [WhooingEverydayService, TrxRepository, LogRepository],
    }).compile();

    service = module.get<WhooingEverydayService>(WhooingEverydayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.skip('should return whooing input data list', () => {
    const rt = service.TEST_getDataListByTime();
    expect(rt[0]).toBeInstanceOf(WhooingInputData);
  });
});
