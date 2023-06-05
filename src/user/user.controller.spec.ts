import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DBModule } from '../lib/db/db.module';
import { UserRepository } from './user.repository';
import { SectionRepository } from '../section/section.repository';
import { TrxRepository } from '../trx/trx.repository';
import { LogRepository } from '../whooloop/log.repository';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      controllers: [UserController],
      providers: [
        UserService,
        UserRepository,
        SectionRepository,
        TrxRepository,
        LogRepository,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
