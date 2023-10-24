import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(1, { message: i18nValidationMessage('validation.MIN.STRING') })
  name: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  phone: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL') })
  email: string;
}
