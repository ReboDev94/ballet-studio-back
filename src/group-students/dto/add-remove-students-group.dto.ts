import { IsArray, IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AddOrRemoveStudentsGroupDto {
  @IsInt({ each: true, message: i18nValidationMessage('valitation.ARRAY.INT') })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  students: number[];
}
