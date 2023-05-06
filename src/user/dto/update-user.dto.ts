import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UpdateUserDto extends PickType(UserEntity, ['password']) {}
