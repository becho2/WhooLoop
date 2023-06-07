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

  @ApiProperty({
    type: 'string',
    description: 'whooing section_id',
    required: true,
  })
  @Expose()
  @Length(1, 10)
  whooing_section_id: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing POST Webhook token',
    required: true,
  })
  @Expose()
  @Length(24, 25)
  whooing_webhook_token: string;

  @ApiProperty({
    type: 'number',
    description: 'section sorting order number',
    required: true,
  })
  @Expose()
  sort_no: number;

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
  updated_last = new Date();
}
