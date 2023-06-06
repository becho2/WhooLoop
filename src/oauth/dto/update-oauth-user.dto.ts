import { PickType } from '@nestjs/swagger';
import { OauthUserEntity } from '../entities/oauth-user.entity';

export class UpdateOauthUserDto extends PickType(OauthUserEntity, [
  'whooing_access_token',
  'whooing_access_token_secret',
  'updated_last',
]) {}
