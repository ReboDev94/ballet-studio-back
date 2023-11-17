import { IsOptional, IsString, IsEnum, Matches } from 'class-validator';
import { IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Degrees } from '../../common/interfaces/degrees';
import { REGEX_HOUR } from 'src/common/constants/regex-hourt';

export class CreateGroupDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  description?: string = '';

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @Matches(REGEX_HOUR, { message: i18nValidationMessage('validation.HOUR') })
  scheduleL?: string = '';

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @Matches(REGEX_HOUR, { message: i18nValidationMessage('validation.HOUR') })
  scheduleM?: string = '';

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @Matches(REGEX_HOUR, { message: i18nValidationMessage('validation.HOUR') })
  scheduleMI?: string = '';

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @Matches(REGEX_HOUR, { message: i18nValidationMessage('validation.HOUR') })
  scheduleJ?: string = '';

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @Matches(REGEX_HOUR, { message: i18nValidationMessage('validation.HOUR') })
  scheduleV?: string = '';

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @Matches(REGEX_HOUR, { message: i18nValidationMessage('validation.HOUR') })
  scheduleS?: string = '';

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @Matches(REGEX_HOUR, { message: i18nValidationMessage('validation.HOUR') })
  scheduleD?: string = '';

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  schoolCycle: number;

  @IsEnum(Degrees, { message: i18nValidationMessage('validation.ENUM') })
  degree: Degrees;

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  teacherId: number;
}
