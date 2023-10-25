import {
  IsDateString,
  Matches,
  IsInt,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AddStudentsToRollCallDto {
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.DATE.STRING') },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @IsInt({ each: true, message: i18nValidationMessage('validation.ARRAY.INT') })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('validation.ARRAY.NOT_EMPTY'),
  })
  groupStudentsIds: number[];
}
