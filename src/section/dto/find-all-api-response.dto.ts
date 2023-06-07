import { PickType } from '@nestjs/swagger';
import { SectionEntity } from '../entities/section.entity';

export class FindAllApiResponseDto extends PickType(SectionEntity, [
  'section_idx',
  'section_name',
  'whooing_webhook_token',
]) {}
