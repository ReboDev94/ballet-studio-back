import { Matches, IsDateString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RollCallByNameDto {
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.DATE.STRING') },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;
}
