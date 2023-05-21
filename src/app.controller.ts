import { Controller, Get, Render, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Render('index')
  index() {
    return { message: 'Hello world!' };
  }

  @Get()
  @Render('my-page')
  myPage(@Request() req) {
    return { accessToken: req };
  }
}
