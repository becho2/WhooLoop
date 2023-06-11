import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { OauthUserRepository } from './oauth-user.repository';
import { DBModule } from '../lib/db/db.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SectionService } from '../section/section.service';
import { SectionRepository } from '../section/section.repository';
import { AccountService } from '../account/account.service';
import { AccountRepository } from '../account/account.repository';
import { WhooingResourceApiService } from '../lib/whooing-resource-api/whooing-resource-api.service';
import { FrequentItemsRepository } from 'src/account/frequent-items.repository';

@Module({
  imports: [DBModule, JwtModule.register({})],
  controllers: [OauthController],
  providers: [
    OauthService,
    AuthService,
    SectionService,
    OauthUserRepository,
    SectionRepository,
    AccountService,
    AccountRepository,
    WhooingResourceApiService,
    FrequentItemsRepository,
  ],
})
export class OauthModule {}
