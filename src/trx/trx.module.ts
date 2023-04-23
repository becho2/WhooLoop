import { Module } from '@nestjs/common';
import { TrxService } from './trx.service';
import { TrxController } from './trx.controller';

@Module({
  controllers: [TrxController],
  providers: [TrxService]
})
export class TrxModule {}
