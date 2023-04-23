import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhooingEverydayModule } from './whooing-everyday/whooing-everyday.module';
import { UserModule } from './user/user.module';
import { SectionModule } from './section/section.module';
import { TrxModule } from './trx/trx.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { DBModule } from './lib/db/db.module';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user/user.repository';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
    }),
    DBModule,
    WhooingEverydayModule,
    UserModule,
    SectionModule,
    TrxModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, UserService, JwtService, UserRepository],
})
export class AppModule {}
