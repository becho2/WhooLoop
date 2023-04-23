import { Injectable } from '@nestjs/common';
import { CreateWhooingEverydayDto } from './dto/create-whooing-everyday.dto';
import { UpdateWhooingEverydayDto } from './dto/update-whooing-everyday.dto';

@Injectable()
export class WhooingEverydayService {
  create(createWhooingEverydayDto: CreateWhooingEverydayDto) {
    return 'This action adds a new whooingEveryday';
  }

  findAll() {
    return `This action returns all whooingEveryday`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whooingEveryday`;
  }

  update(id: number, updateWhooingEverydayDto: UpdateWhooingEverydayDto) {
    return `This action updates a #${id} whooingEveryday`;
  }

  remove(id: number) {
    return `This action removes a #${id} whooingEveryday`;
  }
}
