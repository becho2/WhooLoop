import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhooLoopModule } from './whooloop/whoo-loop.module';
import { UserModule } from './user/user.module';
import { SectionModule } from './section/section.module';
import { TrxModule } from './trx/trx.module';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './lib/db/db.module';
import { AuthModule } from './auth/auth.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
    }),
    DBModule,
    WhooLoopModule,
    UserModule,
    SectionModule,
    TrxModule,
    DBModule,
    OauthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
