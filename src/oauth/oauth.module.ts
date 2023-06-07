import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { OauthUserRepository } from './oauth-user.repository';
import { DBModule } from '../lib/db/db.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SectionService } from '../section/section.service';
import { SectionRepository } from '../section/section.repository';

@Module({
  imports: [DBModule, JwtModule.register({})],
  controllers: [OauthController],
  providers: [
    OauthService,
    AuthService,
    SectionService,
    OauthUserRepository,
    SectionRepository,
  ],
})
export class OauthModule {}
