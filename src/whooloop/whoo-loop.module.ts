import { Module } from '@nestjs/common';
import { WhooLoopService } from './whoo-loop.service';
import { TrxRepository } from '../trx/trx.repository';
import { DBModule } from '../lib/db/db.module';
import { LogRepository } from './log.repository';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), DBModule],
  providers: [WhooLoopService, TrxRepository, LogRepository],
})
export class WhooLoopModule {}
