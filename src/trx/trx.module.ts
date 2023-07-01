import { Module } from '@nestjs/common';
import { TrxService } from './trx.service';
import { TrxController } from './trx.controller';
import { TrxRepository } from './trx.repository';
import { DBModule } from '../lib/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [TrxController],
  providers: [TrxService, TrxRepository],
  exports: [TrxService, TrxRepository],
})
export class TrxModule {}
