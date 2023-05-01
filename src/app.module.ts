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
import dbConfig from './config/dbConfig';
import { DBService } from './lib/db/db.service';

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
    DBModule,
    AuthModule,
    CronModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    UserService,
    JwtService,
    UserRepository,
    DBService,
  ],
})
export class AppModule {}
