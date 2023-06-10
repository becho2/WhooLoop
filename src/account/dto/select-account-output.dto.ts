import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export class SelectAccountOutputDto {
  /** 자산 계정항목 */
  @ApiProperty({
    type: 'string[]',
    description: ' array 자산 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  assets?: string[];

  /** 부채 계정항목 */
  @ApiProperty({
    type: 'string[]',
    description: ' array 부채 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  liabilities?: string[];

  /** 순자산 계정항목 */
  @ApiProperty({
    type: 'string[]',
    description: ' array 순자산 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  capital?: string[];

  /** 비용 계정항목 */
  @ApiProperty({
    type: 'string[]',
    description: ' array 비용 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  expenses?: string[];

  /** 수익 계정항목 */
  @ApiProperty({
    type: 'string[]',
    description: ' array 수익 계정항목',
    required: false,
  })
  @Expose()
  @IsArray()
  @IsOptional()
  income?: string[];
}
