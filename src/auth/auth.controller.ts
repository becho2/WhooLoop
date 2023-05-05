import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginRequestDto } from './login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginRequestDto: LoginRequestDto): string {
    return this.authService.login(loginRequestDto);
  }
}
