import { Test, TestingModule } from '@nestjs/testing';
import { TrxController } from './trx.controller';
import { TrxService } from './trx.service';

describe('TrxController', () => {
  let controller: TrxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrxController],
      providers: [TrxService],
    }).compile();

    controller = module.get<TrxController>(TrxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
