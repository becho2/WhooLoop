import { Injectable } from '@nestjs/common';
import { DBService } from '../lib/db/db.service';
import { LogEntity } from './entities/log.entity';

@Injectable()
export class LogRepository {
  logTable = 'log';

  constructor(private readonly dbService: DBService) {}
  async create(logEntity: LogEntity): Promise<any> {
    return this.dbService.mysql.insert(logEntity).into(this.logTable);
  }
}
