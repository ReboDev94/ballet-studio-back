import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ChangeAttendedDto {
  @IsBoolean({ message: i18nValidationMessage('validation.BOOLEAN') })
  @Transform(
    ({ value }) => [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1,
  )
  attended: boolean;
}
