import { Test, TestingModule } from '@nestjs/testing';
import { WhooingEverydayService } from './whooing-everyday.service';
import { TrxRepository } from '../trx/trx.repository';
import { DBModule } from '../lib/db/db.module';
import { WhooingInputData } from './dto/whooing-input-form.dto';

describe('WhooingEverydayService', () => {
  let service: WhooingEverydayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [WhooingEverydayService, TrxRepository],
    }).compile();

    service = module.get<WhooingEverydayService>(WhooingEverydayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return whooing input data list', () => {
    const rt = service.TEST_getDataListByTime();
    expect(rt).toBeInstanceOf(Array);
    expect(rt[0]).toBeInstanceOf(WhooingInputData);
  });
});
