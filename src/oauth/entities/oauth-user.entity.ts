import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsNumber, Length, MaxLength } from 'class-validator';

export class OauthUserEntity {
  /** userIdx */
  @ApiProperty({
    type: 'number',
    description: 'userIdx',
    required: true,
  })
  @Expose()
  user_idx: number;

  @ApiProperty({
    type: 'number',
    required: true,
  })
  @IsNumber()
  @Expose({ name: 'whooingUserId' })
  whooing_user_id: number;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @MaxLength(255)
  @Expose({ name: 'whooingAccessToken' })
  whooing_access_token: string;

  @ApiProperty({
    type: 'string',
    required: true,
  })
  @MaxLength(255)
  @Expose({ name: 'whooingAccessTokenSecret' })
  whooing_access_token_secret: string;

  /** isDeleted */
  @ApiProperty({
    type: 'string',
    description: 'isDeleted',
    example: 'N',
    required: true,
  })
  @Length(1)
  is_deleted: string;

  @IsDate()
  created: string;

  @IsDate()
  updated_last = new Date();
}
