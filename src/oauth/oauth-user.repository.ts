import { Injectable } from '@nestjs/common';

import { DBService } from '../lib/db/db.service';
import { OauthUserEntity } from './entities/oauth-user.entity';
import { Knex } from 'knex';
import { CreateOauthUserDto } from './dto/create-oauth-user.dto';
import { UpdateOauthUserDto } from './dto/update-oauth-user.dto';

@Injectable()
export class OauthUserRepository {
  userTable = 'oauth_users';
  constructor(private readonly dbService: DBService) {}

  async create(createUserDto: CreateOauthUserDto): Promise<number> {
    const userIdx = await this.dbService.mysql
      .insert(createUserDto)
      .into(this.userTable);

    return userIdx[0];
  }

  async update(
    idx: number,
    updateUserDto: UpdateOauthUserDto,
  ): Promise<boolean> {
    return await this.dbService
      .mysql(this.userTable)
      .where('user_idx', idx)
      .update(updateUserDto);
  }

  async findOne(idx: number) {
    const sql = this.dbService.mysql
      .select(
        'whooing_user_id',
        'whooing_access_token',
        'whooing_access_token_secret',
      )
      .where('user_idx', idx)
      .from<OauthUserEntity>(this.userTable);
    const [rows] = await sql;
    return rows;
  }

  async findUserIdxByWhooingUserId(whooingUserId: number): Promise<any> {
    return await this.dbService
      .mysql(this.userTable)
      .select('user_idx')
      .where('whooing_user_id', whooingUserId)
      .first();
  }

  async remove(
    idx: number,
    trx: Knex.Transaction | undefined,
  ): Promise<boolean> {
    return await (trx ? trx : this.dbService.mysql)(this.userTable)
      .where('user_idx', idx)
      .delete();
  }
}
