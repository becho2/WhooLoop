import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

export class WhooingAccountUnitDto {
  @ApiProperty({
    type: 'string',
    description: 'whooing account id',
    required: true,
  })
  @Expose()
  @Length(1, 10)
  account_id: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing account type',
    required: true,
  })
  @Expose()
  @Length(1, 10)
  type: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing account title',
    required: true,
  })
  @Expose()
  @Length(1, 20)
  title: string;

  @ApiProperty({
    type: 'number',
    description: 'YYYYMMDD whooing account open date',
    example: 20010101,
    required: true,
  })
  @Expose()
  @Length(1, 20)
  open_date: number;

  @ApiProperty({
    type: 'number',
    description: 'YYYYMMDD whooing account close date',
    example: 20230101,
    required: true,
  })
  @Expose()
  @Length(1, 20)
  close_date: number;
}
