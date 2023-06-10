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

  async createMany(createAccountDto: CreateAccountDto[]) {
    return await this.dbService.mysql
      .insert(createAccountDto)
      .into(this.accountTable);
  }

  async update(accountIdx: number, updateAccountDto: UpdateAccountDto) {
    return await this.dbService
      .mysql(this.accountTable)
      .where('account_idx', accountIdx)
      .update(updateAccountDto);
  }

  async findOneBySectionIdx(sectionIdx: number): Promise<AccountEntity> {
    const sql = this.dbService.mysql
      .select(
        'account_idx',
        'assets',
        'liabilities',
        'capital',
        'expenses',
        'income',
      )
      .where('section_idx', sectionIdx)
      .from<AccountEntity>(this.accountTable);
    const [rows] = await sql;
    return rows;
  }

  async findOneByWhooingSectionId(sectionId: string): Promise<AccountEntity> {
    const sql = this.dbService.mysql
      .select('account_idx', 'updated_last')
      .where('section_id', sectionId)
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
