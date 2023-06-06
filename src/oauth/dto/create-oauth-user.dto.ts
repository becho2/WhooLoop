import { PickType } from '@nestjs/swagger';
import { OauthUserEntity } from '../entities/oauth-user.entity';

export class CreateOauthUserDto extends PickType(OauthUserEntity, [
  'whooing_user_id',
  'whooing_access_token',
  'whooing_access_token_secret',
]) {}
