import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DBModule } from '../lib/db/db.module';
import { UserRepository } from './user.repository';
import { SectionRepository } from '../section/section.repository';
import { TrxRepository } from '../trx/trx.repository';
import { LogRepository } from '../whooloop/log.repository';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [
        UserService,
        UserRepository,
        SectionRepository,
        TrxRepository,
        LogRepository,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
