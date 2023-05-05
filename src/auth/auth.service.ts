import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return 'what?';
    const user = await this.userService.findOneByEmail(email);
    return user;
    if (user && user.password === (await bcrypt.hash(password, 12))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(loginRequestDto: LoginRequestDto): string {
    this.userService.findOneByEmail(loginRequestDto.email);
    return 'acessToken';
    // return {
    //   access_token: this.jwtService.sign(loginRequestDto),
    // };
  }

  getAccessToken(): string {
    return 'string';
  }
}
