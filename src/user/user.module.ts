import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DBModule } from '../lib/db/db.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
