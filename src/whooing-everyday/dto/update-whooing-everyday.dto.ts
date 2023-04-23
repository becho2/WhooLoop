import { PartialType } from '@nestjs/mapped-types';
import { CreateWhooingEverydayDto } from './create-whooing-everyday.dto';

export class UpdateWhooingEverydayDto extends PartialType(CreateWhooingEverydayDto) {}
