import { Injectable } from '@nestjs/common';

import { CreateTrxDto } from '../../trx/dto/create-trx.dto';
import { UpdateTrxDto } from '../../trx/dto/update-trx.dto';
import { DBService } from '../db/db.service';
import { TrxEntity } from '../../trx/entities/trx.entity';

@Injectable()
export class TrxRepository {
  trxTable = 'transactions';
  constructor(private readonly dbService: DBService) {}

  async create(createTrxDto: CreateTrxDto) {
    return this.dbService.db.insert(createTrxDto).into(this.trxTable);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findTrxListByTime(time: string): Promise<TrxEntity> {
    const sql = this.dbService.db
      .select(
        'section_idx',
        'transaction_idx',
        'transaction_item',
        'transaction_money',
        'transaction_left',
        'transaction_right',
        'transaction_memo',
      )
      .where('request_time', time)
      .from<TrxEntity>(this.trxTable);
    const [rows] = await sql;
    return rows;
  }

  update(id: number, updateTrxDto: UpdateTrxDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
