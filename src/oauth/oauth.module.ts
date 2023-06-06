import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { OauthUserRepository } from './oauth-user.repository';
import { DBModule } from '../lib/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [OauthController],
  providers: [OauthService, OauthUserRepository],
})
export class OauthModule {}
