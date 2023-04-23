import { Injectable } from '@nestjs/common';

import { CreateSectionDto } from '../../section/dto/create-section.dto';
import { UpdateSectionDto } from '../../section/dto/update-section.dto';
import { DBService } from '../db/db.service';
import { SectionEntity } from '../../section/entities/section.entity';

@Injectable()
export class SectionRepository {
  sectionTable = 'sections';
  constructor(private readonly dbService: DBService) {}

  async create(createSectionDto: CreateSectionDto) {
    return this.dbService.db.insert(createSectionDto).into(this.sectionTable);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findSectionListByUserIdx(idx: number): Promise<SectionEntity> {
    const sql = this.dbService.db
      .select('section_idx')
      .where('user_idx', idx)
      .from<SectionEntity>(this.sectionTable);
    const [rows] = await sql;
    return rows;
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
