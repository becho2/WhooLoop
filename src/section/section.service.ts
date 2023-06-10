import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionRepository } from './section.repository';
import { SectionEntity } from './entities/section.entity';
import { FindAllApiResponseDto } from './dto/find-all-api-response.dto';

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
    return await this.sectionRepository.findAll(userIdx);
  }

  async findAllForFront(userIdx: number): Promise<FindAllApiResponseDto[]> {
    const sectionList = await this.sectionRepository.findAll(userIdx);
    return sectionList.map((section) => {
      return {
        section_idx: section.section_idx,
        section_name: section.section_name,
        whooing_webhook_token: section.whooing_webhook_token,
      };
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} section`;
  }

  async remove(idx: number, userIdx: number): Promise<boolean> {
    return await this.sectionRepository.remove(idx, userIdx);
  }

  /**
   * @param userIdx
   * @param whooingAccessData
   */
  async createWhooingSections(userIdx: number, whooingSectionList: any) {
    const createSectionList: CreateSectionDto[] = [];
    whooingSectionList.forEach((section: any, index: number) => {
      const createSectionData: CreateSectionDto = {
        user_idx: userIdx,
        section_name: section.title,
        whooing_section_id: section.section_id,
        whooing_webhook_token: section.webhook_token,
        sort_no: index,
      };
      createSectionList.push(createSectionData);
    });

    this.createMany(createSectionList);
  }
}
