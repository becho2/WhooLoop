import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsOptional, Length } from 'class-validator';

export class TrxEntity {
  /** transactionIdx */
  @ApiProperty({
    type: 'number',
    description: 'transactionIdx',
    required: true,
  })
  @Expose()
  transaction_idx: number;

  /** related section idx */
  @ApiProperty({
    type: 'number',
    description: 'related section idx',
    required: true,
  })
  @Expose()
  section_idx: number;

  /** 이 반복요청의 별칭 */
  @ApiProperty({
    type: 'string',
    description: '이 반복요청의 별칭',
    required: false,
  })
  @Expose()
  @IsOptional()
  @Length(1, 30)
  transaction_nickname?: string;

  /** 요청을 반복할 요일(d: 매일, 1~7: 월~일요일) */
  @ApiProperty({
    type: 'string',
    description: '요청을 반복할 요일(d: 매일, 1~7: 월~일요일)',
    required: false,
  })
  @Expose()
  @IsOptional()
  @Length(1, 1)
  request_day_of_week?: string;

  /** 요청을 보낼 시간 HHmm */
  @ApiProperty({
    type: 'string',
    description: '요청을 보낼 시간 HHmm',
    required: false,
  })
  @Expose()
  @IsOptional()
  @Length(1, 4)
  request_time?: string;

  /** 후잉 item 입력값 */
  @ApiProperty({
    type: 'string',
    description: '후잉 item 입력값',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  transaction_item: string;

  /** 후잉 금액 입력값 */
  @ApiProperty({
    type: 'number',
    description: '후잉 금액 입력값',
    required: true,
  })
  @Expose()
  transaction_money: number;

  /** 후잉 좌변(비용) */
  @ApiProperty({
    type: 'string',
    description: '후잉 좌변(비용)',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  transaction_left: string;

  /** 후잉 우변(수익) */
  @ApiProperty({
    type: 'string',
    description: '후잉 우변(수익)',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  transaction_right: string;

  /** 후잉 거래 메모 */
  @ApiProperty({
    type: 'number',
    description: '후잉 거래 메모',
    required: false,
  })
  @Expose()
  @IsOptional()
  transaction_memo?: number;

  /** isDeleted */
  @ApiProperty({
    type: 'string',
    description: 'isDeleted',
    example: 'N',
    required: true,
  })
  @Expose()
  @Length(1, 1)
  is_deleted: string;

  @IsDate()
  created: string;

  @IsDate()
  updated_last: string;
}
