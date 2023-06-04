import { Injectable } from '@nestjs/common';
import { DBService } from '../lib/db/db.service';
import { LogEntity } from './entities/log.entity';
import { Knex } from 'knex';

@Injectable()
export class LogRepository {
  logTable = 'log';

  constructor(private readonly dbService: DBService) {}
  async create(logEntity: LogEntity): Promise<any> {
    return this.dbService.mysql.insert(logEntity).into(this.logTable);
  }

  /**
   * 회원탈퇴시 해당 유저의 트랜잭션으로 입력된 로그에서 후잉 웹훅 URL정보 삭제
   * @param trxIdxList
   * @returns
   */
  async updateWebhookUrlsEmptyForDeleteUser(
    trxIdxList: string[],
    trx: Knex.Transaction | undefined,
  ): Promise<boolean> {
    await (trx ? trx : this.dbService.mysql)(this.logTable)
      .whereIn('transaction_idx', trxIdxList)
      .update('request_url', '');

    return true;
  }
}
