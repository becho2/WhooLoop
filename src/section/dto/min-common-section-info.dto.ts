import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

export class MinCommonSectionInfoDto {
  @ApiProperty({
    type: 'string',
    description: 'webhook url에 해당하는 section title 혹은 계정 별칭 설정',
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
  @Length(1, 20)
  whooing_webhook_token: string;
}
