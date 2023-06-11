import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, Length } from 'class-validator';

export class CreateFrequentItemDto {
  /** 연결된 section_id FK */
  @ApiProperty({
    type: 'string',
    description: '연결된 whooing section_id FK',
    required: true,
  })
  @Expose()
  @IsNumber()
  section_id: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing slot',
    required: true,
  })
  @Expose()
  whooing_slot: string;

  @ApiProperty({
    type: 'string',
    description: 'whooing 자주입력거래 고유 id값',
    required: true,
  })
  @Expose()
  whooing_item_id: string;

  /** 후잉 item 입력값 */
  @ApiProperty({
    type: 'string',
    description: '후잉 item 입력값',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  item: string;

  /** 후잉 금액 입력값 */
  @ApiProperty({
    type: 'number',
    description: '후잉 금액 입력값',
    required: true,
  })
  @Expose()
  money: number;

  /** 후잉 좌변(비용) */
  @ApiProperty({
    type: 'string',
    description: '후잉 좌변(비용)',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  left: string;

  /** 후잉 우변(수익) */
  @ApiProperty({
    type: 'string',
    description: '후잉 우변(수익)',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  right: string;
}
