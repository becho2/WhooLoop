import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    type: 'number',
    description: 'section_idx',
    required: true,
  })
  @Expose()
  section_idx: number;

  /** 연결된 section_id FK */
  @ApiProperty({
    type: 'number',
    description: '연결된 whooing section_id FK',
    required: true,
  })
  @Expose()
  @IsNumber()
  section_id: string;

  /** 자산 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 자산 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  assets?: string;

  /** 부채 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 부채 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  liabilities?: string;

  /** 순자산 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 순자산 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  capital?: string;

  /** 비용 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 비용 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  expenses?: string;

  /** 수익 계정항목 */
  @ApiProperty({
    type: 'string',
    description: 'JSON array 수익 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  income?: string;
}
