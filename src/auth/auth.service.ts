import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './login-request.dto';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  getAccessToken(email: string, userIdx: number): string {
    return this.jwtService.sign(
      { email: email, user_idx: userIdx },
      {
        secret: 'accessKeyOfDailyWhooing',
        expiresIn: '1h',
      },
    );
  }
}
