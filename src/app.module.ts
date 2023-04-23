import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhooingEverydayModule } from './whooing-everyday/whooing-everyday.module';
import { UserModule } from './user/user.module';
import { SectionModule } from './section/section.module';
import { TrxModule } from './trx/trx.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import dbConfig from './config/dbConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, dbConfig],
      isGlobal: true,
    }),
    WhooingEverydayModule,
    UserModule,
    SectionModule,
    TrxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
