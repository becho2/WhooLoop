import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DBService } from '../lib/db/db.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  userTable = 'users';
  constructor(private readonly dbService: DBService) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkUserExists(createUserDto.email);
    return this.dbService.db.insert(createUserDto).into(this.userTable);
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const sql = this.dbService.db
      .select('user_idx')
      .where('email', email)
      .from<UserEntity>('users');
    const [rows] = await sql;

    if (rows !== undefined && rows.user_idx > 0) {
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
