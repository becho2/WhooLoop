import { Injectable } from '@nestjs/common';
import { CreateTrxDto } from './dto/create-trx.dto';
import { UpdateTrxDto } from './dto/update-trx.dto';
import { TrxRepository } from './trx.repository';

@Injectable()
export class TrxService {
  constructor(private readonly trxRepository: TrxRepository) {}
  create(createTrxDto: CreateTrxDto) {
    return this.trxRepository.create(createTrxDto);
  }

  findAll(userIdx: number) {
    return this.trxRepository.findAll(userIdx);
  }

  update(idx: number, updateTrxDto: UpdateTrxDto) {
    return this.trxRepository.update(idx, updateTrxDto);
  }

  remove(trxIdx: number) {
    return this.trxRepository.remove(trxIdx);
  }
}
