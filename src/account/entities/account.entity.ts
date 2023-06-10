import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class AccountEntity {
  /** accountIdx */
  @ApiProperty({
    type: 'number',
    description: 'accountIdx',
    required: true,
  })
  @Expose()
  account_idx: number;

  @ApiProperty({
    type: 'number',
    description: 'section_idx',
    required: true,
  })
  @Expose()
  section_idx: number;

  @ApiProperty({
    type: 'number',
    description: '연결된 whooing section_id FK',
    required: true,
  })
  @Expose()
  section_id: string;

  /** 자산 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 자산 계정항목',
    required: false,
  })
  @Expose()
  @IsOptional()
  assets?: string;

  /** 부채 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 부채 계정항목',
    required: false,
  })
  @Expose()
  @IsOptional()
  liabilities?: string;

  /** 순자산 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 순자산 계정항목',
    required: false,
  })
  @Expose()
  @IsOptional()
  capital?: string;

  /** 비용 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 비용 계정항목',
    required: false,
  })
  @Expose()
  @IsOptional()
  expenses?: string;

  /** 수익 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 수익 계정항목',
    required: false,
  })
  @Expose()
  @IsOptional()
  income?: string;

  /** created */
  @ApiProperty({
    type: 'string',
    description: 'created',
    example: '2022-05-15T00:00:00.000Z',
    required: true,
  })
  @Expose()
  @IsDate()
  created: string;

  /** updatedLast */
  @ApiProperty({
    type: 'string',
    description: 'updatedLast',
    example: '2022-05-15T00:00:00.000Z',
    required: true,
  })
  @Expose()
  @IsDate()
  updated_last: string;
}
