import { BadRequestException, Injectable } from '@nestjs/common';

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

  async findOne(idx: number) {
    const sql = this.dbService.db
      .select('user_email')
      .where('user_idx', idx)
      .from<UserEntity>('users');
    const [rows] = await sql;
    return rows;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const sql = this.dbService.db
      .select('user_idx', 'password')
      .where('email', email)
      .from<UserEntity>('users');
    const [rows] = await sql;
    return rows;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
