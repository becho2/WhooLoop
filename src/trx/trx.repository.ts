import { Injectable } from '@nestjs/common';

import { DBService } from '../lib/db/db.service';
import { TrxEntity } from './entities/trx.entity';
import { CreateTrxDto } from './dto/create-trx.dto';
import { UpdateTrxDto } from './dto/update-trx.dto';
import { ViewTimeDataListEntity } from '../whooloop/entities/view-time-data-list.entity';
import { Knex } from 'knex';

@Injectable()
export class TrxRepository {
  trxTable = 'transactions';
  timeView = 'view_time_data_list';
  constructor(private readonly dbService: DBService) {}
  async create(createTrxDto: CreateTrxDto) {
    return this.dbService.mysql.insert(createTrxDto).into(this.trxTable);
  }

  async findAll(userIdx: number): Promise<TrxEntity[]> {
    const sql = this.dbService.mysql
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
        'expire_date',
      )
      .where({
        user_idx: userIdx,
        is_deleted: 'N',
      })
      .from<TrxEntity>(this.trxTable);
    const rows = await sql;
    return rows;
  }

  // deleted 상태이든 아니든 상관없이 해당 user의 모든 trx idx를 가져옴(탈퇴시 log삭제를 위함)
  async findAllIdxOfUser(
    userIdx: number,
    trx: Knex.Transaction | undefined,
  ): Promise<number[]> {
    const rows = await (trx ? trx : this.dbService.mysql)(this.trxTable)
      .select('transaction_idx')
      .where({
        user_idx: userIdx,
      });
    return rows.map((row) => row.transaction_idx);
  }

  async findByTime(
    requestedDayOfWeekDatas: any[],
    requestTime: string,
  ): Promise<ViewTimeDataListEntity[]> {
    const sql = this.dbService.mysql
      .select(
        'transaction_idx',
        'webhook_token',
        'transaction_item',
        'transaction_money_amount',
        'transaction_left',
        'transaction_right',
        'transaction_memo',
      )
      .whereIn('request_day_of_week', requestedDayOfWeekDatas)
      .where({
        request_time: requestTime,
      })
      .from(this.timeView);
    const rows = await sql;
    return rows;
  }

  async findOne(idx: number) {
    const sql = this.dbService.mysql
      .select('*')
      .where('user_idx', idx)
      .from<TrxEntity>(this.trxTable);
    const [rows] = await sql;
    return rows;
  }

  async update(
    idx: number,
    userIdx: number,
    updateTrxDto: UpdateTrxDto,
  ): Promise<boolean> {
    await this.dbService
      .mysql(this.trxTable)
      .where({ transaction_idx: idx, user_idx: userIdx })
      .update(updateTrxDto);

    return true;
  }

  async turnOffExpiredTrxs(today: string) {
    await this.dbService
      .mysql(this.trxTable)
      .where({ expire_date: today })
      .update({
        work_status: 'OFF',
        updated_last: new Date(),
      });
    return true;
  }

  async remove(idx: number, userIdx: number): Promise<boolean> {
    await this.dbService
      .mysql(this.trxTable)
      .where({ transaction_idx: idx, user_idx: userIdx })
      .update({
        is_deleted: 'Y',
        updated_last: new Date(),
      });
    return true;
  }

  async removeAllByUserIdx(
    userIdx: number,
    trx: Knex.Transaction | undefined,
  ): Promise<boolean> {
    await (trx ? trx : this.dbService.mysql)(this.trxTable)
      .where({ user_idx: userIdx })
      .delete();

    return true;
  }
}
