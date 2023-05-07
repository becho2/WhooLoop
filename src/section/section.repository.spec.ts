import { Test, TestingModule } from '@nestjs/testing';
import { DBModule } from '../lib/db/db.module';
import { SectionRepository } from './section.repository';

describe('SectionRepository', () => {
  let repository: SectionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule],
      providers: [SectionRepository],
    }).compile();

    repository = module.get<SectionRepository>(SectionRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
