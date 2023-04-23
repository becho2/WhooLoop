import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import dbConfig from 'src/config/dbConfig';
import knex, { Knex } from 'knex';

@Injectable()
export class DBService {
  db: Knex;
  constructor(
    @Inject(dbConfig.KEY) private config: ConfigType<typeof dbConfig>,
  ) {
    this.db = knex(this.config.mysql.poolOptions);
  }
}
