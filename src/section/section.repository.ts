import { BadRequestException, Injectable } from '@nestjs/common';

import { DBService } from '../lib/db/db.service';
import { SectionEntity } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionRepository {
  sectionTable = 'sections';
  constructor(private readonly dbService: DBService) {}
  async create(createSectionDto: CreateSectionDto) {
    return this.dbService.db.insert(createSectionDto).into(this.sectionTable);
  }

  async findAll(userIdx: number) {
    const sql = this.dbService.db
      .select(
        'section_idx',
        'section_name',
        'whooing_webhook_url',
        'sort_no',
        'created',
      )
      .where({
        user_idx: userIdx,
        is_deleted: 'N',
      })
      .from<SectionEntity>(this.sectionTable);
    const [rows] = await sql;
    return rows;
  }

  async findOne(idx: number) {
    const sql = this.dbService.db
      .select('email')
      .where('user_idx', idx)
      .from<SectionEntity>(this.sectionTable);
    const [rows] = await sql;
    return rows;
  }

  async findOneByEmail(email: string): Promise<SectionEntity> {
    const sql = this.dbService.db
      .select('user_idx', 'password')
      .where('email', email)
      .from<SectionEntity>(this.sectionTable);
    const [rows] = await sql;
    return rows;
  }

  async update(idx: number, updateSectionDto: UpdateSectionDto) {
    return this.dbService
      .db(this.sectionTable)
      .where('section_idx', idx)
      .update(updateSectionDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
