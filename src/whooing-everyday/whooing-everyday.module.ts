import { Module } from '@nestjs/common';
import { WhooingEverydayService } from './whooing-everyday.service';
import { TrxRepository } from '../trx/trx.repository';
import { DBModule } from '../lib/db/db.module';

@Module({
  imports: [DBModule],
  providers: [WhooingEverydayService, TrxRepository],
})
export class WhooingEverydayModule {}
