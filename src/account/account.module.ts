import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { DBModule } from '../lib/db/db.module';

/**
 * account = 후잉 계정항목을 뜻함
 * 후잉 계정항목들을 불러와서 저장하고 항목의 목록을 프론트로 보내줌
 */
@Module({
  imports: [DBModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, WhooingResourceApiService],
})
export class AccountModule {}
