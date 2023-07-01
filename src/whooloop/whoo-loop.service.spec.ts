import { Test, TestingModule } from '@nestjs/testing';
import { WhooLoopService } from './whoo-loop.service';
import { DBModule } from '../lib/db/db.module';
import { WhooingInputData } from './dto/whooing-input-form.dto';
import { LogRepository } from './log.repository';
import { OauthModule } from '../oauth/oauth.module';
import { TrxModule } from '../trx/trx.module';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';

describe('WhooLoopService', () => {
  let service: WhooLoopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule, OauthModule, TrxModule],
      providers: [WhooLoopService, LogRepository, WhooingResourceApiService],
    }).compile();

    service = module.get<WhooLoopService>(WhooLoopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.skip('should return whooing input data list', () => {
    const rt = service.TEST_getDataListByTime();
    expect(rt[0]).toBeInstanceOf(WhooingInputData);
  });
});
