import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WhooingFrequentItemDto } from './whooing-frequent-item.dto';

export class WhooingFrequentItemsResponseDto {
  @ApiProperty({
    type: 'WhooingFrequentItemDto[]',
    description: '자주입력거래 슬롯1',
    required: true,
  })
  @Expose()
  slot1: WhooingFrequentItemDto[];

  @ApiProperty({
    type: 'WhooingFrequentItemDto[]',
    description: '자주입력거래 슬롯2',
    required: true,
  })
  @Expose()
  slot2?: WhooingFrequentItemDto[];

  @ApiProperty({
    type: 'WhooingFrequentItemDto[]',
    description: '자주입력거래 슬롯3',
    required: true,
  })
  @Expose()
  slot3?: WhooingFrequentItemDto[];
}
