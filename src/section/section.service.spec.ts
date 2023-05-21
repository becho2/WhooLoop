import { Test, TestingModule } from '@nestjs/testing';
import { SectionService } from './section.service';
import { SectionRepository } from './section.repository';
import { DBModule } from '../lib/db/db.module';

describe('SectionService', () => {
  let service: SectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [SectionService, SectionRepository],
    }).compile();

    service = module.get<SectionService>(SectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
