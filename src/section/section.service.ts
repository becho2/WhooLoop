import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionRepository } from './section.repository';

@Injectable()
export class SectionService {
  constructor(private readonly sectionRepository: SectionRepository) {}

  create(createSectionDto: CreateSectionDto) {
    return 'This action adds a new section';
  }

  findAll(userIdx: number) {
    return this.sectionRepository.findAll(userIdx);
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
