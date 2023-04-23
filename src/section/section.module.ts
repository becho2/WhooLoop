import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { SectionRepository } from '../lib/repositories/section.repository';
import { DBModule } from 'src/lib/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [SectionController],
  providers: [SectionService, SectionRepository],
})
export class SectionModule {}
