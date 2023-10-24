import { PartialType } from '@nestjs/mapped-types';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Degrees } from 'src/common/interfaces/degrees';
import { IsEnum, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SearchGroupDto extends PartialType(PageOptionsDto) {
  @IsEnum(Degrees, { message: i18nValidationMessage('validation.ENUM') })
  @IsOptional()
  degree?: Degrees;

  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.INT') })
  @IsOptional()
  teacher?: number;
}
