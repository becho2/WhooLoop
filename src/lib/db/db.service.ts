import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import dbConfig from '../../config/dbConfig';
import knex, { Knex } from 'knex';

@Injectable()
export class DBService {
  mysql: Knex;
  oracle: Knex;
  constructor(
    @Inject(dbConfig.KEY) private config: ConfigType<typeof dbConfig>,
  ) {
    this.mysql = knex(this.config.mysql.poolOptions);
    this.oracle = knex(this.config.oracle.poolOptions);
  }
}
