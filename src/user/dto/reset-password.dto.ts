import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class ResetPasswordDto extends PickType(UserEntity, ['email']) {}
