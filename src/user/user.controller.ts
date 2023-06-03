import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
    // findOne(@Param('idx', ParseIntPipe) idx: number) {
    // ParseIntPipe를 이용해 string으로 들어온 idx값을 int(number)로 변경
    return this.userService.findOne(req.user.idx);
  }

  @UseGuards(AuthGuard('jwtAccessGuard'))
  @Patch()
  update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.idx, updateUserDto);
  }

  @Delete(':idx')
  remove(@Param('idx') idx: string) {
    // 또는 파라미터 앞에 +를 붙여 string으로 들어온 idx값을 int(number)로 변경 가능
    return this.userService.remove(+idx);
  }
}
