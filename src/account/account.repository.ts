import { Injectable } from '@nestjs/common';

import { DBService } from '../lib/db/db.service';
import { AccountEntity } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Knex } from 'knex';

@Injectable()
export class AccountRepository {
  accountTable = 'accounts';
  constructor(private readonly dbService: DBService) {}
  async create(createAccountDto: CreateAccountDto) {
    return await this.dbService.mysql
      .insert(createAccountDto)
      .into(this.accountTable);
  }

  async update(idx: number, updateAccountDto: UpdateAccountDto) {
    return await this.dbService
      .mysql(this.accountTable)
      .where('account_idx', idx)
      .update(updateAccountDto);
  }

  async findOne(idx: number) {
    const sql = this.dbService.mysql
      .select('email')
      .where('user_idx', idx)
      .from<AccountEntity>(this.accountTable);
    const [rows] = await sql;
    return rows;
  }

  async findOneByEmail(email: string): Promise<AccountEntity> {
    const sql = this.dbService.mysql
      .select('user_idx', 'password')
      .where('email', email)
      .from<AccountEntity>(this.accountTable);
    const [rows] = await sql;
    return rows;
  }

  async remove(idx: number, userIdx: number) {
    await this.dbService
      .mysql(this.accountTable)
      .where({ account_idx: idx, user_idx: userIdx })
      .update({ is_deleted: 'Y' });

    return true;
  }

  async removeAllByAccountIdx(
    accountIdx: number,
    trx: Knex.Transaction | undefined,
  ): Promise<boolean> {
    await (trx ? trx : this.dbService.mysql)(this.accountTable)
      .where({ account_idx: accountIdx })
      .delete();

    return true;
  }
}
