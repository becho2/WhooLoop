import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhooingEverydayModule } from './whooing-everyday/whooing-everyday.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [WhooingEverydayModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
