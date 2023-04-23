import { PartialType } from '@nestjs/swagger';
import { CreateTrxDto } from './create-trx.dto';

export class UpdateTrxDto extends PartialType(CreateTrxDto) {}
