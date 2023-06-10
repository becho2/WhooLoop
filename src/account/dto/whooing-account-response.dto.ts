import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WhooingAccountUnitDto } from './whooing-account-unit.dto';

export class WhooingAccountResponseDto {
  @ApiProperty({
    type: 'WhooingAccountUnitDto[]',
    description: '자산 항목 리스트',
    required: true,
  })
  @Expose()
  assets: WhooingAccountUnitDto[];

  @ApiProperty({
    type: 'WhooingAccountUnitDto[]',
    description: '부채 항목 리스트',
    required: true,
  })
  @Expose()
  liabilities: WhooingAccountUnitDto[];

  @ApiProperty({
    type: 'WhooingAccountUnitDto[]',
    description: '순자산 항목 리스트',
    required: true,
  })
  @Expose()
  capital: WhooingAccountUnitDto[];

  @ApiProperty({
    type: 'WhooingAccountUnitDto[]',
    description: '수익 항목 리스트',
    required: true,
  })
  @Expose()
  income: WhooingAccountUnitDto[];

  @ApiProperty({
    type: 'WhooingAccountUnitDto[]',
    description: '비용 항목 리스트',
    required: true,
  })
  @Expose()
  expenses: WhooingAccountUnitDto[];
}
