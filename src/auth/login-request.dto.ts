import { PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';

export class LoginRequestDto extends PickType(UserEntity, [
  'email',
  'password',
]) {}
