import { IsEmail, IsString, IsObject } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class createMailDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL') })
  to: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  subject: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  template: string;

  @IsObject({ message: i18nValidationMessage('validation.IS_OBJECT') })
  context: object;
}
