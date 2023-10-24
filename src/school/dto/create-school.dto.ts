import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateSchoolDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(1, { message: i18nValidationMessage('validation.MIN.STRING') })
  name: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  description?: string = '';

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  phone?: string = '';

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  address?: string = '';

  @IsString({
    each: true,
    message: i18nValidationMessage('validation.ARRAY.STRING'),
  })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsOptional()
  certifications?: string[] = [];

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(1, { message: i18nValidationMessage('validation.MIN.STRING') })
  directorName: string;
}
