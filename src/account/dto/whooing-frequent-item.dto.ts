import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

export class WhooingFrequentItemDto {
  @ApiProperty({
    type: 'string',
    description: 'whooing frequent item id',
    required: true,
  })
  @Expose()
  @Length(1, 5)
  item_id: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing frequent item item name',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  item: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing frequent item money amount',
    required: true,
  })
  @Expose()
  money: number;

  @ApiProperty({
    type: 'string',
    description: 'whooing frequent item left account',
    required: true,
  })
  @Expose()
  @Length(1, 10)
  l_account: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing frequent item left account id',
    required: true,
  })
  @Expose()
  @Length(1, 5)
  l_account_id: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing frequent item right account',
    required: true,
  })
  @Expose()
  @Length(1, 10)
  r_account: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing frequent item right account id',
    required: true,
  })
  @Expose()
  @Length(1, 5)
  r_account_id: string;
}
