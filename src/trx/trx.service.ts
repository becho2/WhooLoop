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

  async findAll(userIdx: number) {
    return await this.trxRepository.findAll(userIdx);
  }

  async update(
    idx: number,
    userIdx: number,
    updateTrxDto: UpdateTrxDto,
  ): Promise<boolean> {
    return await this.trxRepository.update(idx, userIdx, updateTrxDto);
  }

  async remove(trxIdx: number, userIdx: number): Promise<boolean> {
    return await this.trxRepository.remove(trxIdx, userIdx);
  }
}
