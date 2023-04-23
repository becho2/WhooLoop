import { Injectable } from '@nestjs/common';
import { CreateTrxDto } from './dto/create-trx.dto';
import { UpdateTrxDto } from './dto/update-trx.dto';

@Injectable()
export class TrxService {
  create(createTrxDto: CreateTrxDto) {
    return 'This action adds a new trx';
  }

  findAll() {
    return `This action returns all trx`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trx`;
  }

  update(id: number, updateTrxDto: UpdateTrxDto) {
    return `This action updates a #${id} trx`;
  }

  remove(id: number) {
    return `This action removes a #${id} trx`;
  }
}
