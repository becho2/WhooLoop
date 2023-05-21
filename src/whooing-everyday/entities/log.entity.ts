import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsOptional, Length } from 'class-validator';

export class LogEntity {
  /** logIdx */
  @ApiProperty({
    type: 'number',
    description: 'logIdx',
    required: true,
  })
  @Expose()
  log_idx: number;

  /** transactionIdx */
  @ApiProperty({
    type: 'number',
    description: 'transactionIdx',
    required: true,
  })
  @Expose()
  transaction_idx: number;

  /** requestUrl */
  @ApiProperty({
    type: 'string',
    description: 'requestUrl',
    required: true,
  })
  @Expose()
  @Length(1, 70)
  request_url: string;

  /** requestBody */
  @ApiProperty({
    type: 'string',
    description: 'requestBody',
    required: false,
  })
  @Expose()
  @IsOptional()
  request_body?: string;

  /** responseBody */
  @ApiProperty({
    type: 'string',
    description: 'responseBody',
    required: false,
  })
  @Expose()
  @IsOptional()
  response_body?: string;

  /** wtime */
  @ApiProperty({
    type: 'string',
    description: 'wtime',
    example: '2022-05-15T00:00:00.000Z',
    required: true,
  })
  @Expose()
  @IsDate()
  wtime: string;
}
