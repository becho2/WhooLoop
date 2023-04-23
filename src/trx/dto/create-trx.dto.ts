import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, Length } from 'class-validator';

export class CreateTrxDto {
  @ApiProperty({
    type: 'number',
    description: 'related section idx',
    required: true,
  })
  @Expose()
  section_idx: number;

  @ApiProperty({
    type: 'string',
    description: '이 반복요청의 별칭',
    required: false,
  })
  @Expose()
  @IsOptional()
  @Length(1, 30)
  transaction_nickname?: string;

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

  @ApiProperty({
    type: 'string',
    description: '후잉 item 입력값',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  transaction_item: string;

  @ApiProperty({
    type: 'number',
    description: '후잉 금액 입력값',
    required: true,
  })
  @Expose()
  transaction_money: number;

  @ApiProperty({
    type: 'string',
    description: '후잉 좌변(비용)',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  transaction_left: string;

  @ApiProperty({
    type: 'string',
    description: '후잉 우변(수익)',
    required: true,
  })
  @Expose()
  @Length(1, 40)
  transaction_right: string;

  @ApiProperty({
    type: 'number',
    description: '후잉 거래 메모',
    required: false,
  })
  @Expose()
  @IsOptional()
  transaction_memo?: number;
}
