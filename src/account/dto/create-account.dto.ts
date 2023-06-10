import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateAccountDto {
  /** 연결된 section_idx FK */
  @ApiProperty({
    type: 'number',
    description: '연결된 section_idx FK',
    required: true,
  })
  @Expose()
  @IsNumber()
  sectionIdx: number;

  /** 자산 계정항목 */
  @ApiProperty({
    type: Array<string>,
    description: 'JSON array 자산 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  assets?: Array<string>;

  /** 부채 계정항목 */
  @ApiProperty({
    type: Array<string>,
    description: 'JSON array 부채 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  liabilities?: Array<string>;

  /** 순자산 계정항목 */
  @ApiProperty({
    type: Array<string>,
    description: 'JSON array 순자산 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  capital?: Array<string>;

  /** 비용 계정항목 */
  @ApiProperty({
    type: Array<string>,
    description: 'JSON array 비용 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  expenses?: Array<string>;

  /** 수익 계정항목 */
  @ApiProperty({
    type: Array<string>,
    description: 'JSON array 수익 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  income?: Array<string>;
}
