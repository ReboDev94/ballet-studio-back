import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ConfirmEmailDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL') })
  email: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(1, { message: i18nValidationMessage('validation.MIN.STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX.STRING') })
  token: string;
}
