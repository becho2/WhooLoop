import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { DBService } from '../lib/db/db.service';

@Injectable()
export class UserService {
  userTable = 'users';
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dbService: DBService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkUserExists(createUserDto.email);
    createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
    // return this.dbService.db.insert(createUserDto).into(this.userTable);
    return this.userRepository.create(createUserDto);
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const row = await this.userRepository.findOneByEmail(email);
    // const row = await this.findOneByEmail(email);
    if (row !== undefined && row.user_idx > 0) {
      throw new BadRequestException('Email already exists');
    } else {
      return true;
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
