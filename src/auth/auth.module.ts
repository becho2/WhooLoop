import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../lib/repositories/user.repository';
import { DBModule } from '../lib/db/db.module';

@Module({
  imports: [DBModule],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
