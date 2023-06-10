import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { DBService } from '../lib/db/db.service';
import { SectionRepository } from '../section/section.repository';
import { TrxRepository } from '../trx/trx.repository';
import { LogRepository } from '../whooloop/log.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly dbService: DBService,
    private readonly sectionRepository: SectionRepository,
    private readonly trxRepository: TrxRepository,
    private readonly logRepository: LogRepository,
  ) {}

  /**
   * @TODO oauth_user에 대한 탈퇴 기능으로 변경하기 (코드 위치도 옮길 것)
   * @param idx
   * @returns
   */
  async remove(idx: number): Promise<boolean> {
    try {
      await this.dbService.mysql.transaction(async (trx) => {
        // await this.userRepository.remove(idx, trx);
        await this.sectionRepository.removeAllByUserIdx(idx, trx);
        await this.trxRepository.removeAllByUserIdx(idx, trx);
        const idxList: number[] = await this.trxRepository.findAllIdxOfUser(
          idx,
          trx,
        );
        await this.logRepository.updateWebhookUrlsEmptyForDeleteUser(
          idxList,
          trx,
        );
      });
    } catch {
      throw new InternalServerErrorException('Failed to remove user');
    }

    return true;
  }
}
