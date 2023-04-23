import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhooingEverydayModule } from './whooing-everyday/whooing-everyday.module';

@Module({
  imports: [WhooingEverydayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
