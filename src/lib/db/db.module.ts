import { Module } from '@nestjs/common';
import { DBService } from './db.service';
import { ConfigModule } from '@nestjs/config';
import dbConfig from '../../config/dbConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [dbConfig],
      isGlobal: true,
    }),
  ],
  providers: [DBService],
  exports: [DBService],
})
export class DBModule {}
