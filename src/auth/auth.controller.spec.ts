import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DBModule } from '../lib/db/db.module';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { SectionRepository } from '../section/section.repository';
import { TrxRepository } from '../trx/trx.repository';
import { LogRepository } from '../whooing-everyday/log.repository';
import { ConfigModule } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DBModule,
        ConfigModule.forRoot({
          envFilePath: [
            `${__dirname}/../config/env/.${process.env.NODE_ENV}.env`,
          ],
          isGlobal: true,
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UserService,
        UserRepository,
        SectionRepository,
        TrxRepository,
        LogRepository,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
