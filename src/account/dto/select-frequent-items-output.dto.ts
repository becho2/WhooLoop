import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Length } from 'class-validator';

export class SelectFrequentItemsOutputDto {
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
    description: 'whooing frequent item left account title',
    required: true,
  })
  @Expose()
  @Length(1, 10)
  left: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing frequent item right account title',
    required: true,
  })
  @Expose()
  @Length(1, 10)
  right: string;
}
