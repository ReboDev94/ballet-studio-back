import {
  ArrayNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { regexPassword } from 'src/common/utils';
import { IsArray, IsEnum } from 'class-validator';
import { ValidRoles } from '../interfaces/valid-roles';

export class CreateUserDto {
  @IsString({ message: 'validation.STRING' })
  @MinLength(1, { message: 'validation.MIN.STRING' })
  name: string;

  @IsString({ message: 'validation.STRING' })
  @IsEmail({}, { message: 'validation.EMAIL' })
  email: string;

  @IsString({ message: 'validation.STRING' })
  @MinLength(6, { message: 'validation.MIN.STRING' })
  @MaxLength(50, { message: 'validation.MAX.STRING' })
  @Matches(regexPassword, {
    message: 'validation.PASSWORD',
  })
  password: string;

  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  phone: string;

  @IsArray({ message: 'validation.IS_ARRAY' })
  @ArrayNotEmpty({ message: 'validation.ARRAY.NOT_EMPTY' })
  @IsEnum(ValidRoles, { each: true, message: 'validation.ENUM' })
  roles: ValidRoles[];

  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  photo: string | null;
}
