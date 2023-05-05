import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { DBModule } from '../lib/db/db.module';

@Module({
  imports: [DBModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, LocalStrategy, UserService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
