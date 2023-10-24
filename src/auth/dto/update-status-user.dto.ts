import { IsBoolean } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateStatusUserDto {
  @IsBoolean({ message: i18nValidationMessage('validation.BOOLEAN') })
  status: boolean;
}
