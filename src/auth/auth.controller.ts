import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './login-request.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * @deprecated Oauth 인증 방식으로 변경되면서 삭제 예정
   * @param loginRequestDto
   * @returns
   */
  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<string> {
    const email = loginRequestDto.email;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnprocessableEntityException(
        '해당 Email이 회원 목록에 존재하지 않습니다.(The email does not exist in user list.)',
      );
    }

    const isAuth = await bcrypt.compare(
      loginRequestDto.password,
      user.password,
    );
    if (!isAuth) {
      throw new UnprocessableEntityException(
        '비밀번호가 틀렸습니다.(The password is not correct.)',
      );
    }
    return this.authService.getAccessToken(email, user.user_idx);
  }
}
