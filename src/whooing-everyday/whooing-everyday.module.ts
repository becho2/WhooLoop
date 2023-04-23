import { Module } from '@nestjs/common';
import { WhooingEverydayService } from './whooing-everyday.service';
import { WhooingEverydayController } from './whooing-everyday.controller';

@Module({
  controllers: [WhooingEverydayController],
  providers: [WhooingEverydayService]
})
export class WhooingEverydayModule {}
