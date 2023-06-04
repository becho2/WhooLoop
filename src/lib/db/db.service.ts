import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import dbConfig from '../../config/db-config';
import knex, { Knex } from 'knex';

@Injectable()
export class DBService {
  mysql: Knex;
  constructor(
    @Inject(dbConfig.KEY) private config: ConfigType<typeof dbConfig>,
  ) {
    this.mysql = knex(this.config.mysql.poolOptions);
  }
}
