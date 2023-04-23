import { Test, TestingModule } from '@nestjs/testing';
import { WhooingEverydayController } from './whooing-everyday.controller';
import { WhooingEverydayService } from './whooing-everyday.service';

describe('WhooingEverydayController', () => {
  let controller: WhooingEverydayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhooingEverydayController],
      providers: [WhooingEverydayService],
    }).compile();

    controller = module.get<WhooingEverydayController>(WhooingEverydayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
