import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DBService } from '../lib/db/db.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  userTable = 'users';
  constructor(private readonly dbService: DBService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.dbService.mysql.insert(createUserDto).into(this.userTable);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(idx: number) {
    const sql = this.dbService.mysql
      .select('email')
      .where('user_idx', idx)
      .from<UserEntity>(this.userTable);
    const [rows] = await sql;
    return rows;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const sql = this.dbService.mysql
      .select('user_idx', 'password')
      .where('email', email)
      .from<UserEntity>(this.userTable);
    const [rows] = await sql;
    return rows;
  }

  async update(idx: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    return this.dbService
      .mysql(this.userTable)
      .where('user_idx', idx)
      .update(updateUserDto);
  }

  async remove(idx: number): Promise<boolean> {
    return this.dbService
      .mysql(this.userTable)
      .where('user_idx', idx)
      .update('is_deleted', 'Y');
  }
}
