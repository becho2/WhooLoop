import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhooingEverydayModule } from './whooing-everyday/whooing-everyday.module';
import { UserModule } from './user/user.module';
import { SectionModule } from './section/section.module';
import { TrxModule } from './trx/trx.module';

@Module({
  imports: [WhooingEverydayModule, UserModule, SectionModule, TrxModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
