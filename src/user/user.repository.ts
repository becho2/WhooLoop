import { DBService } from '../lib/db/db.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

export class UserRepository {
  userTable = 'users';
  constructor(private readonly dbService: DBService) {}

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    const sql = this.dbService.db
      .select('user_idx')
      .where('email', email)
      .from<UserEntity>('users');
    const [rows] = await sql;
    console.log(rows);
    return rows;
  }

  create(createUserDto: CreateUserDto) {
    return this.dbService.db.insert(createUserDto).into(this.userTable);
  }
}
