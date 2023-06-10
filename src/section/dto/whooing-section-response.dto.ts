import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

export class WhooingSectionResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'whooing section title 섹션명',
    required: true,
  })
  @Expose()
  @Length(1, 50)
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing section_id',
    required: true,
  })
  @Expose()
  @Length(1, 10)
  section_id: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing Webhook token',
    required: true,
  })
  @Expose()
  @Length(1, 20)
  webhook_token: string;
}
