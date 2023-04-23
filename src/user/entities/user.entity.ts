import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, Length } from 'class-validator';

export class UserEntity {
  /** userIdx */
  @ApiProperty({
    type: 'number',
    description: 'userIdx',
    required: true,
  })
  user_idx: number;

  /** email */
  @ApiProperty({
    type: 'string',
    description: 'email',
    required: true,
  })
  @Expose()
  @Length(1, 50)
  email: string;

  /** password */
  @ApiProperty({
    type: 'string',
    description: 'password',
    required: true,
  })
  @Length(6, 255)
  password: string;

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
  updated_last: string;
}
