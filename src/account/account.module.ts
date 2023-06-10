import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

/**
 * account = 후잉 계정항목을 뜻함
 * 후잉 계정항목들을 불러와서 저장하고 항목의 목록을 프론트로 보내줌
 */
@Module({
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
