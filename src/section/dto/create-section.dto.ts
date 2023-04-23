import { PickType } from '@nestjs/swagger';
import { SectionEntity } from '../entities/section.entity';

export class CreateSectionDto extends PickType(SectionEntity, [
  'user_idx',
  'section_name',
  'whooing_webhook_url',
]) {}
