import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrxService } from './trx.service';
import { CreateTrxDto } from './dto/create-trx.dto';
import { UpdateTrxDto } from './dto/update-trx.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('trx')
@Controller('trx')
export class TrxController {
  constructor(private readonly trxService: TrxService) {}

  @Post()
  create(@Body() createTrxDto: CreateTrxDto) {
    return this.trxService.create(createTrxDto);
  }

  @Get()
  findAll() {
    return this.trxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trxService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrxDto: UpdateTrxDto) {
    return this.trxService.update(+id, updateTrxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trxService.remove(+id);
  }
}
