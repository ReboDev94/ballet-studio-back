import { IsEmail, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SendEmailResetPasswordDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL') })
  email: string;
}
