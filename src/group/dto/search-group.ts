import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Degrees } from 'src/common/interfaces/degrees';
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Transform, Type } from 'class-transformer';

const CURRENT_ANIO = new Date().getFullYear();
export class SearchGroupDto extends PageOptionsDto {
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Degrees, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  @Type(() => String)
  @Transform(({ value }: { value: string }) => value.split(','))
  degree?: Degrees;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  teacher?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.INT') })
  schoolCycle?: number = CURRENT_ANIO;
}
