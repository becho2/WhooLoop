import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { DBService } from 'src/lib/db/db.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    UserService,
    UserRepository,
    DBService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
