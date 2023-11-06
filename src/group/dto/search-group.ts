import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Degrees } from 'src/common/interfaces/degrees';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SearchGroupDto extends PageOptionsDto {
  @IsEnum(Degrees, { message: i18nValidationMessage('validation.ENUM') })
  @IsOptional()
  degree?: Degrees;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  teacher?: string;
}
