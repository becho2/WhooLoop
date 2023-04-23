import { PickType } from '@nestjs/mapped-types';
import { TrxEntity } from '../entities/trx.entity';

export class CreateTrxDto extends PickType(TrxEntity, [
  'section_idx',
  'request_day_of_week',
  'request_time',
  'transaction_nickname',
  'transaction_item',
  'transaction_money',
  'transaction_left',
  'transaction_right',
  'transaction_memo',
]) {}
