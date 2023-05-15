import { Module } from '@nestjs/common';
import { WhooingEverydayService } from './whooing-everyday.service';
import { TrxRepository } from '../trx/trx.repository';
import { DBModule } from '../lib/db/db.module';
import { LogRepository } from './log.repository';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), DBModule],
  providers: [WhooingEverydayService, TrxRepository, LogRepository],
})
export class WhooingEverydayModule {}
