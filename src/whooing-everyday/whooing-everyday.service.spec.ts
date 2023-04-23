import { Test, TestingModule } from '@nestjs/testing';
import { WhooingEverydayService } from './whooing-everyday.service';

describe('WhooingEverydayService', () => {
  let service: WhooingEverydayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhooingEverydayService],
    }).compile();

    service = module.get<WhooingEverydayService>(WhooingEverydayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
