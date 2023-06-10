import { IsDate } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends CreateAccountDto {
  @IsDate()
  updated_last = new Date();
}
