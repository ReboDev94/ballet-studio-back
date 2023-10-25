import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsEqualTo } from 'src/common/decorators';
import { regexPassword } from 'src/common/utils';

export class ChangePasswordDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL') })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(1, { message: i18nValidationMessage('validation.MIN.STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX.STRING') })
  token: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.MIN.STRING'),
  })
  @MaxLength(30, {
    message: i18nValidationMessage('validation.MAX.STRING'),
  })
  @Matches(regexPassword, {
    message: i18nValidationMessage('validation.PASSWORD'),
  })
  password: string;

  @IsEqualTo<ChangePasswordDto>('password', {
    message: i18nValidationMessage('validation.CONFIRM_PASSWORD'),
  })
  confirmPassword: string;
}
