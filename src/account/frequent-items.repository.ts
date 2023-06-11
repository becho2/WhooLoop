import { Injectable } from '@nestjs/common';

import { DBService } from '../lib/db/db.service';
import { CreateFrequentItemDto } from './dto/create-frequent-item.dto';

@Injectable()
export class FrequentItemsRepository {
  frequentItemsTable = 'frequent_items';
  constructor(private readonly dbService: DBService) {}

  async createMany(createList: CreateFrequentItemDto[]) {
    return await this.dbService.mysql
      .insert(createList)
      .into(this.frequentItemsTable);
  }

  async deleteManyBySectionId(sectionId: string) {
    await this.dbService
      .mysql(this.frequentItemsTable)
      .where({ section_id: sectionId })
      .delete();

    return true;
  }
}
