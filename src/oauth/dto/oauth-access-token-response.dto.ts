import { Expose } from 'class-transformer';

export class OauthAccessTokenResponseDto {
  @Expose({ name: 'whooing_user_id' })
  whooingUserId: number;

  @Expose({ name: 'whooing_access_token' })
  whooingAccessToken: string;

  @Expose({ name: 'whooing_access_token_secret' })
  whooingAccessTokenSecret: string;
}
