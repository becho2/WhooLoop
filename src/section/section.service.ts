import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionRepository } from './section.repository';
import { SectionEntity } from './entities/section.entity';

@Injectable()
export class SectionService {
  constructor(private readonly sectionRepository: SectionRepository) {}

  create(createSectionDto: CreateSectionDto) {
    createSectionDto.sort_no = 1;
    return this.sectionRepository.create(createSectionDto);
  }

  async findAll(userIdx: number): Promise<SectionEntity[]> {
    const sections = await this.sectionRepository.findAll(userIdx);
    if (sections.length === 0) {
      throw new NotFoundException('섹션이 존재하지 않습니다.');
    }
    return sections;
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
