import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

import { regexPassword } from 'src/common/utils';

export class RegisterUserDto {
  @IsString({ message: 'validation.STRING' })
  @IsEmail({}, { message: 'validation.EMAIL' })
  email: string;

  @IsString({ message: 'validation.STRING' })
  @MinLength(6, { message: 'validation.MIN.STRING' })
  @MaxLength(30, { message: 'validation.MAX.STRING' })
  @Matches(regexPassword, {
    message: 'validation.PASSWORD',
  })
  password: string;
}
