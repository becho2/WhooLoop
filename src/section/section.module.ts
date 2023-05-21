import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { SectionRepository } from './section.repository';
import { DBModule } from '../lib/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [SectionController],
  providers: [SectionService, SectionRepository],
})
export class SectionModule {}
