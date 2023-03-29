import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';

import { regexPassword } from 'src/common/utils';
export class LoginUserDto {
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
}
