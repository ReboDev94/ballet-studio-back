import {
  ArrayNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { IsArray, IsEnum } from 'class-validator';
import { ValidRoles } from '../interfaces/valid-roles';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(1, { message: i18nValidationMessage('validation.MIN.STRING') })
  name: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL') })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  phone?: string = '';

  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('validation.ARRAY.NOT_EMPTY'),
  })
  @IsEnum(ValidRoles, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  roles: ValidRoles[];
}
