import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';
import { DBService } from '../lib/db/db.service';
import { SectionRepository } from '../section/section.repository';
import { TrxRepository } from '../trx/trx.repository';
import { LogRepository } from '../whooing-everyday/log.repository';

@Injectable()
export class UserService {
  userTable = 'users';
  constructor(
    private readonly dbService: DBService,
    private readonly userRepository: UserRepository,
    private readonly sectionRepository: SectionRepository,
    private readonly trxRepository: TrxRepository,
    private readonly logRepository: LogRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    await this.checkUserExists(createUserDto.email);
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    return this.userRepository.create(createUserDto);
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const rows = await this.userRepository.findOneByEmail(email);
    if (rows !== undefined && rows.user_idx > 0) {
      throw new BadRequestException('Email already exists');
    } else {
      return true;
    }
  }

  async findOne(idx: number): Promise<UserEntity> {
    return await this.userRepository.findOne(idx);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneByEmail(email);
  }

  async update(idx: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    return await this.userRepository.update(idx, updateUserDto);
  }

  /**
   * email로 해당 아이디에 활성화되어있는 반복거래 중 가장 첫번째 거래에 메모로 랜덤초기화 비밀번호 보내기
   * @param email
   * @returns
   */
  async resetPassword(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('The user does not exist');
    }

    const randomPassword = '134801';
    const updateUserDto: UpdateUserDto = {
      password: randomPassword,
    };

    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    return await this.userRepository.update(user.user_idx, updateUserDto);
  }

  async remove(idx: number): Promise<boolean> {
    try {
      await this.dbService.mysql.transaction(async (trx) => {
        await this.userRepository.remove(idx, trx);
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
