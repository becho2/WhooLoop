import { Test, TestingModule } from '@nestjs/testing';
import { TrxController } from './trx.controller';
import { TrxService } from './trx.service';
import { TrxRepository } from './trx.repository';
import { DBModule } from '../lib/db/db.module';

describe('TrxController', () => {
  let controller: TrxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      controllers: [TrxController],
      providers: [TrxService, TrxRepository],
    }).compile();

    controller = module.get<TrxController>(TrxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
