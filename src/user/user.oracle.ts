import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DBService } from '../lib/db/db.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserOracle {
  userTable = 'users';
  constructor(private readonly dbService: DBService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.dbService.oracle.insert(createUserDto).into(this.userTable);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(idx: number) {
    const sql = this.dbService.oracle
      .select('email')
      .where('user_idx', idx)
      .from<UserEntity>(this.userTable);
    const [rows] = await sql;
    return rows;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const sql = this.dbService.oracle
      .select('user_idx', 'password')
      .where('email', email)
      .from<UserEntity>(this.userTable);
    const [rows] = await sql;
    return rows;
  }

  async update(idx: number, updateUserDto: UpdateUserDto) {
    return this.dbService
      .mysql(this.userTable)
      .where('user_idx', idx)
      .update(updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
