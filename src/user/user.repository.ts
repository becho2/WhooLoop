import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DBService } from '../lib/db/db.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  userTable = 'users';
  constructor(private readonly dbService: DBService) {}

  async create(createUserDto: CreateUserDto) {
    return this.dbService.db.insert(createUserDto).into(this.userTable);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const sql = this.dbService.db
      .select('user_idx')
      .where('email', email)
      .from<UserEntity>('users');
    const [row] = await sql;
    return row;
  }

  async findOneOrFail(idx: number): Promise<UserEntity> {
    const sql = this.dbService.db
      .select('user_idx', 'email')
      .where('user_idx', idx)
      .from<UserEntity>('users');
    const [row] = await sql;
    return row;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}