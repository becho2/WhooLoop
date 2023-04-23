import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { DBModule } from '../lib/db/db.module';

@Module({
  imports: [DBModule],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
