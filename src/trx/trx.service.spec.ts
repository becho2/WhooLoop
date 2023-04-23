import { Test, TestingModule } from '@nestjs/testing';
import { TrxService } from './trx.service';

describe('TrxService', () => {
  let service: TrxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrxService],
    }).compile();

    service = module.get<TrxService>(TrxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
