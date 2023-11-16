import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SearchStudenthDto extends PageOptionsDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  name?: string;
}
