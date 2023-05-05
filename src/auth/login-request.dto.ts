import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';

export class LoginRequestDto extends PickType(UserEntity, [
  'email',
  'password',
]) {}
