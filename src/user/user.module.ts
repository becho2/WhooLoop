import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DBService } from '../lib/db/db.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DBService],
})
export class UserModule {}
