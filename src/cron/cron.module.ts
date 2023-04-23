import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { DBModule } from '../lib/db/db.module';
import { TrxRepository } from '../lib/repositories/trx.repository';

@Module({
  imports: [DBModule],
  providers: [CronService, TrxRepository],
})
export class CronModule {}
