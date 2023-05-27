import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getAccessToken(email: string, userIdx: number): string {
    return this.jwtService.sign(
      { email: email, user_idx: userIdx },
      {
        secret: process.env.JWT_ACCESS_KEY,
        expiresIn: '1h',
      },
    );
  }
}
