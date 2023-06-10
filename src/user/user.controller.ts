import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * @TODO 관리자 기능에서 전체 유저목록 확인시 권한확인 뒤에 접근가능하도록 개발 필요
   * @param req
   * @returns
   */
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Delete()
  @UseGuards(AuthGuard('jwtAccessGuard'))
  remove(@Request() req: any): Promise<boolean> {
    return this.userService.remove(req.user.idx);
  }
}
