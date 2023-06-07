import { Injectable } from '@nestjs/common';

import { DBService } from '../lib/db/db.service';
import { SectionEntity } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Knex } from 'knex';

@Injectable()
export class SectionRepository {
  sectionTable = 'sections';
  constructor(private readonly dbService: DBService) {}
  async create(createSectionDto: CreateSectionDto) {
    return await this.dbService.mysql
      .insert(createSectionDto)
      .into(this.sectionTable);
  }

  async createMany(createSectionList: CreateSectionDto[]) {
    return await this.dbService.mysql
      .insert(createSectionList)
      .into(this.sectionTable);
  }

  async update(idx: number, updateSectionDto: UpdateSectionDto) {
    return await this.dbService
      .mysql(this.sectionTable)
      .where('section_idx', idx)
      .update(updateSectionDto);
  }

  async findAll(userIdx: number): Promise<SectionEntity[]> {
    const sql = this.dbService.mysql
      .select('section_idx', 'section_name', 'whooing_webhook_url', 'created')
      .where({
        user_idx: userIdx,
        is_deleted: 'N',
      })
      .from<SectionEntity>(this.sectionTable);
    const rows = await sql;
    return rows;
  }

  async findOne(idx: number) {
    const sql = this.dbService.mysql
      .select('email')
      .where('user_idx', idx)
      .from<SectionEntity>(this.sectionTable);
    const [rows] = await sql;
    return rows;
  }

  async findOneByEmail(email: string): Promise<SectionEntity> {
    const sql = this.dbService.mysql
      .select('user_idx', 'password')
      .where('email', email)
      .from<SectionEntity>(this.sectionTable);
    const [rows] = await sql;
    return rows;
  }

  async remove(idx: number, userIdx: number) {
    await this.dbService
      .mysql(this.sectionTable)
      .where({ section_idx: idx, user_idx: userIdx })
      .update({ is_deleted: 'Y' });

    return true;
  }

  async removeAllByUserIdx(
    userIdx: number,
    trx: Knex.Transaction | undefined,
  ): Promise<boolean> {
    await (trx ? trx : this.dbService.mysql)(this.sectionTable)
      .where({ user_idx: userIdx })
      .delete();

    return true;
  }
}
