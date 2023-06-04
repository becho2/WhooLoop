import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { DBModule } from '../lib/db/db.module';
import { SectionRepository } from '../section/section.repository';
import { TrxRepository } from '../trx/trx.repository';
import { LogRepository } from '../whooing-everyday/log.repository';

@Module({
  imports: [DBModule, PassportModule, JwtModule.register({})],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    SectionRepository,
    TrxRepository,
    LogRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
