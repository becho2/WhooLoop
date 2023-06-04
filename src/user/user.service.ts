import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  userTable = 'users';
  constructor(private userRepository: UserRepository) {}

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

  findAll() {
    return `This action returns all user`;
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

  async remove(idx: number): Promise<boolean> {
    return await this.userRepository.remove(idx);
  }
}
