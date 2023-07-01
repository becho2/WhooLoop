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

  async findByTime(
    requestedDayOfWeekDatas: any[],
    requestTime: string,
  ): Promise<any[]> {
    return await this.trxRepository.findByTime(
      requestedDayOfWeekDatas,
      requestTime,
    );
  }

  async update(
    idx: number,
    userIdx: number,
    updateTrxDto: UpdateTrxDto,
  ): Promise<boolean> {
    return await this.trxRepository.update(idx, userIdx, updateTrxDto);
  }

  async turnOffExpiredTrxs(today: string): Promise<boolean> {
    return await this.trxRepository.turnOffExpiredTrxs(today);
  }

  async findUserIdxByTrxIdx(trxIdx: number): Promise<number> {
    return await this.trxRepository.findUserIdxByTrxIdx(trxIdx);
  }

  async remove(trxIdx: number, userIdx: number): Promise<boolean> {
    return await this.trxRepository.remove(trxIdx, userIdx);
  }
}
