import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

export class SearchStudentsAreNotGroupDto extends PageOptionsDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  name?: string = '';
}
