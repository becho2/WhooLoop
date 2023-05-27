import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DBModule } from '../lib/db/db.module';
import { UserRepository } from './user.repository';
import { JwtAccessStrategy } from '../lib/auth/jwt-access.strategy';
import { UserOracle } from './user.oracle';

@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [JwtAccessStrategy, UserService, UserRepository, UserOracle],
})
export class UserModule {}
