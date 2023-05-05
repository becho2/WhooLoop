import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhooingEverydayModule } from './whooing-everyday/whooing-everyday.module';
import { UserModule } from './user/user.module';
import { SectionModule } from './section/section.module';
import { TrxModule } from './trx/trx.module';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './lib/db/db.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
    }),
    DBModule,
    WhooingEverydayModule,
    UserModule,
    SectionModule,
    TrxModule,
    DBModule,
    ServeStaticModule.forRoot({
      // vue.js 사용을 위한 설치 및 import (https://docs.nestjs.com/recipes/serve-static)
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
