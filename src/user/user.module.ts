import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DBModule } from '../lib/db/db.module';
import { JwtAccessStrategy } from '../lib/auth/jwt-access.strategy';
import { SectionRepository } from '../section/section.repository';
import { TrxRepository } from '../trx/trx.repository';
import { LogRepository } from '../whooloop/log.repository';

@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [
    JwtAccessStrategy,
    UserService,
    SectionRepository,
    TrxRepository,
    LogRepository,
  ],
})
export class UserModule {}
