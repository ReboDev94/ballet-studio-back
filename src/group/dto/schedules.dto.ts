import { IsEnum, IsString, Matches } from 'class-validator';
import { Days } from '../../common/interfaces/days';
import { REGEX_HOUR } from '../../common/constants/regex-hourt';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SchedulesDto {
  @IsEnum(Days, { message: i18nValidationMessage('validation.ENUM') })
  day: Days;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @Matches(REGEX_HOUR, { message: i18nValidationMessage('validation.HOUR') })
  hour: string;
}
