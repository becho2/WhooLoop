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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 200, description: 'Create a user successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * @TODO 관리자 기능에서 전체 유저목록 확인시 권한확인 뒤에 접근가능하도록 개발 필요
   * @param req
   * @returns
   */
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get()
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({
    status: 200,
    description: 'Get a user successfully',
    isArray: false,
  })
  @UseGuards(AuthGuard('jwtAccessGuard'))
  findOne(@Request() req: any) {
    return this.userService.findOne(req.user.idx);
  }

  @Patch()
  @UseGuards(AuthGuard('jwtAccessGuard'))
  update(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    return this.userService.update(req.user.idx, updateUserDto);
  }

  @Delete(':idx')
  @UseGuards(AuthGuard('jwtAccessGuard'))
  remove(@Request() req: any): Promise<boolean> {
    return this.userService.remove(req.user.idx);
  }
}
