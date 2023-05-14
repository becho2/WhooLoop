import { Module } from '@nestjs/common';
import { TrxService } from './trx.service';
import { TrxController } from './trx.controller';
import { TrxRepository } from './trx.repository';
import { DBModule } from 'src/lib/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [TrxController],
  providers: [TrxService, TrxRepository],
})
export class TrxModule {}
