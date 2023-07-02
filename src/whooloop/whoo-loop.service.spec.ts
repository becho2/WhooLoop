import { Test, TestingModule } from '@nestjs/testing';
import { WhooLoopService } from './whoo-loop.service';
import { DBModule } from '../lib/db/db.module';
import { WhooingInputData } from './dto/whooing-input-form.dto';
import { LogRepository } from './log.repository';
import { OauthModule } from '../oauth/oauth.module';
import { TrxModule } from '../trx/trx.module';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { LogEntity } from './entities/log.entity';

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

  // 실패시 메시지 보내는 함수 테스트 // DB연결 실패로 테스트 실패
  it.skip('message', () => {
    // 로그 저장 준비
    const testLogData = new LogEntity();
    testLogData.request_url = 'https://whooing.com/a';
    testLogData.request_body = 'dataJson';
    testLogData.transaction_idx = 16;
    testLogData.response_body = 'Error: error';

    service.sendErrorAlarmByWhooingMessage(testLogData);
  });
});
