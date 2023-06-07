import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionRepository } from './section.repository';
import { SectionEntity } from './entities/section.entity';

@Injectable()
export class SectionService {
  constructor(private readonly sectionRepository: SectionRepository) {}

  async create(createSectionDto: CreateSectionDto) {
    return this.sectionRepository.create(createSectionDto);
  }

  async createMany(createSectionList: CreateSectionDto[]) {
    return this.sectionRepository.createMany(createSectionList);
  }

  async update(sectionIdx: number, updateSectionDto: UpdateSectionDto) {
    return await this.sectionRepository.update(sectionIdx, updateSectionDto);
  }

  async findAll(userIdx: number): Promise<SectionEntity[]> {
    const sections = await this.sectionRepository.findAll(userIdx);
    return sections;
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  async remove(idx: number, userIdx: number): Promise<boolean> {
    return await this.sectionRepository.remove(idx, userIdx);
  }
}
