import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  Matches,
} from 'class-validator';
import { IsInt } from 'class-validator';
import { Degrees } from '../../common/interfaces/degrees';
import { i18nValidationMessage } from 'nestjs-i18n';
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

  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.DATE.STRING') },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: string;

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  schoolCycle: number;

  @IsEnum(Degrees, { message: i18nValidationMessage('validation.ENUM') })
  degree: Degrees;

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  teacherId: number;
}
