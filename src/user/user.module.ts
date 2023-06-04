import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DBModule } from '../lib/db/db.module';
import { UserRepository } from './user.repository';
import { JwtAccessStrategy } from '../lib/auth/jwt-access.strategy';

@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [JwtAccessStrategy, UserService, UserRepository],
})
export class UserModule {}
