import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth-payload.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getAccessToken(userIdx: number): string {
    const authPayloadDto: AuthPayloadDto = {
      userIdx: userIdx,
    };
    return this.jwtService.sign(authPayloadDto, {
      secret: process.env.JWT_ACCESS_KEY,
      expiresIn: '1h',
    });
  }
}
