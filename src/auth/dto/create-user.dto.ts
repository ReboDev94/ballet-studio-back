import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { regexPassword } from 'src/common/utils';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(regexPassword, {
    message: 'Password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @IsOptional()
  phone: string;
}
