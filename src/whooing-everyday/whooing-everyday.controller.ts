import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WhooingEverydayService } from './whooing-everyday.service';
import { CreateWhooingEverydayDto } from './dto/create-whooing-everyday.dto';
import { UpdateWhooingEverydayDto } from './dto/update-whooing-everyday.dto';

@Controller('whooing-everyday')
export class WhooingEverydayController {
  constructor(
    private readonly whooingEverydayService: WhooingEverydayService,
  ) {}

  @Post()
  create(@Body() createWhooingEverydayDto: CreateWhooingEverydayDto) {
    return this.whooingEverydayService.create(createWhooingEverydayDto);
  }

  @Get()
  findAll() {
    return this.whooingEverydayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whooingEverydayService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWhooingEverydayDto: UpdateWhooingEverydayDto,
  ) {
    return this.whooingEverydayService.update(+id, updateWhooingEverydayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whooingEverydayService.remove(+id);
  }
}
