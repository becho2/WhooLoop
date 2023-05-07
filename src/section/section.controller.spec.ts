import { Test, TestingModule } from '@nestjs/testing';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';
import { DBModule } from '../lib/db/db.module';
import { SectionRepository } from './section.repository';

describe('SectionController', () => {
  let controller: SectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      controllers: [SectionController],
      providers: [SectionService, SectionRepository],
    }).compile();

    controller = module.get<SectionController>(SectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
