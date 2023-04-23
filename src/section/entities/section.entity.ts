import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, Length } from 'class-validator';

export class SectionEntity {
  /** sectionIdx */
  @ApiProperty({
    type: 'number',
    description: 'sectionIdx',
    required: true,
  })
  @Expose()
  section_idx: number;

  /** ownered user idx */
  @ApiProperty({
    type: 'number',
    description: 'ownered user idx',
    required: true,
  })
  @Length(1, 50)
  @Expose()
  user_idx: number;

  /** webhook url에 해당하는 section 혹은 계정 별칭 설정 */
  @ApiProperty({
    type: 'string',
    description: 'webhook url에 해당하는 section 혹은 계정 별칭 설정',
    required: true,
  })
  @Expose()
  @Length(1, 50)
  section_name: string;

  /** whooing POST Webhook URL */
  @ApiProperty({
    type: 'string',
    description: 'whooing POST Webhook URL',
    required: true,
  })
  @Expose()
  @Length(1, 60)
  whooing_webhook_url: string;

  /** isDeleted */
  @ApiProperty({
    type: 'string',
    description: 'isDeleted',
    example: 'N',
    required: true,
  })
  @Expose()
  @Length(1, 1)
  is_deleted: string;

  @IsDate()
  created: string;

  @IsDate()
  updated_last: string;
}
