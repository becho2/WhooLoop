import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TrxService } from './trx.service';
import { CreateTrxDto } from './dto/create-trx.dto';
import { UpdateTrxDto } from './dto/update-trx.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('trx')
@Controller('trx')
export class TrxController {
  constructor(private readonly trxService: TrxService) {}

  @Post()
  @UseGuards(AuthGuard('jwtAccessGuard'))
  create(@Request() req: any, @Body() createTrxDto: CreateTrxDto) {
    createTrxDto.user_idx = req.user.idx;
    return this.trxService.create(createTrxDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions of a user' })
  @ApiResponse({
    status: 200,
    description: 'Get sections successfully',
    isArray: true,
  })
  @UseGuards(AuthGuard('jwtAccessGuard'))
  findAll(@Request() req: any) {
    return this.trxService.findAll(req.user.idx);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwtAccessGuard'))
  update(@Param('id') id: string, @Body() updateTrxDto: UpdateTrxDto) {
    return this.trxService.update(+id, updateTrxDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwtAccessGuard'))
  remove(@Param('id') id: string) {
    return this.trxService.remove(+id);
  }
}
