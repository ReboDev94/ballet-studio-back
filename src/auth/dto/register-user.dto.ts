import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { regexPassword } from 'src/common/utils';

export class RegisterUserDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL') })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(6, { message: i18nValidationMessage('validation.MIN.STRING') })
  @MaxLength(30, { message: i18nValidationMessage('validation.MAX.STRING') })
  @Matches(regexPassword, {
    message: i18nValidationMessage('validation.PASSWORD'),
  })
  password: string;
}
