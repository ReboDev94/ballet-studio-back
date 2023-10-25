import {
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsOlder } from './../../common/utils/is-older';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateStudentDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(1, { message: 'validation.MIN.STRING' })
  name: string;

  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.DATE.STRING') },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dateOfBirth: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  address: string;

  @IsString({
    each: true,
    message: i18nValidationMessage('validation.ARRAY.STRING'),
  })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsOptional()
  dieseses?: string[];

  @ValidateIf((o) => {
    if (!o.dateOfBirth) return true;
    return !IsOlder(o.dateOfBirth);
  })
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @MinLength(1, { message: i18nValidationMessage('validation.MIN.STRING') })
  tutorName?: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL') })
  @IsOptional()
  tutorEmail?: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  tutorPhone: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  tutorCelPhone: string;

  // @IsBoolean()
  // @IsOptional()
  // tutorAuthorizePhotos: boolean;
}
