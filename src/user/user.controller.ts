import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
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

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':idx')
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({
    status: 200,
    description: 'Get a user successfully',
    isArray: false,
  })
  findOne(@Param('idx', ParseIntPipe) idx: number) {
    // ParseIntPipe를 이용해 string으로 들어온 idx값을 int(number)로 변경
    return this.userService.findOne(idx);
  }

  @UseGuards(AuthGuard('jwtAccessGuard'))
  @Patch(':idx')
  update(@Param('idx') idx: string, @Body() updateUserDto: UpdateUserDto) {
    // 파라미터 앞에 +를 붙여 string으로 들어온 idx값을 int(number)로 변경
    return this.userService.update(+idx, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
