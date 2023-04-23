import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: '이메일, 후잉 계정과 동일한 이메일 권장',
    example: 'abcd1234@whooing.com',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    description: '패스워드',
    example: '2rjswjfEodkftbdjqt!?',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}
