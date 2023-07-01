import { Module } from '@nestjs/common';
import { WhooLoopService } from './whoo-loop.service';
import { DBModule } from '../lib/db/db.module';
import { LogRepository } from './log.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { TrxModule } from '../trx/trx.module';
import { OauthModule } from '../oauth/oauth.module';

@Module({
  imports: [ScheduleModule.forRoot(), DBModule, TrxModule, OauthModule],
  providers: [WhooLoopService, LogRepository, WhooingResourceApiService],
})
export class WhooLoopModule {}
