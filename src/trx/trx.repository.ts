import { BadRequestException, Injectable } from '@nestjs/common';

import { DBService } from '../lib/db/db.service';
import { TrxEntity } from './entities/trx.entity';
import { CreateTrxDto } from './dto/create-trx.dto';
import { UpdateTrxDto } from './dto/update-trx.dto';

@Injectable()
export class TrxRepository {
  trxTable = 'transactions';
  constructor(private readonly dbService: DBService) {}
  async create(createTrxDto: CreateTrxDto) {
    return this.dbService.db.insert(createTrxDto).into(this.trxTable);
  }

  async findAll(userIdx: number) {
    const sql = this.dbService.db
      .select(
        'transaction_idx',
        'section_idx',
        'transaction_nickname',
        'request_day_of_week',
        'request_time',
        'transaction_item',
        'transaction_money_amount',
        'transaction_left',
        'transaction_right',
        'transaction_memo',
        'work_status',
        'created',
        'updated_last',
      )
      .where({
        user_idx: userIdx,
        is_deleted: 'N',
      })
      .from<TrxEntity>(this.trxTable);
    const rows = await sql;
    return rows;
  }

  async findOne(idx: number) {
    const sql = this.dbService.db
      .select('*')
      .where('user_idx', idx)
      .from<TrxEntity>(this.trxTable);
    const [rows] = await sql;
    return rows;
  }

  async update(idx: number, updateTrxDto: UpdateTrxDto) {
    return this.dbService
      .db(this.trxTable)
      .where('trx_idx', idx)
      .update(updateTrxDto);
  }

  remove(idx: number) {
    return this.dbService.db(this.trxTable).where({ trx_idx: idx }).update({
      is_deleted: 'Y',
    });
  }
}