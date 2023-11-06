import { PageOptionsDto } from '../../common/dto/page-options.dto';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ValidRoles } from '../interfaces/valid-roles';
import { Transform, Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SearchUserDto extends PageOptionsDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(ValidRoles, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  @Type(() => String)
  @Transform(({ value }: { value: string }) => value.split(','))
  roles?: ValidRoles[];

  @IsBoolean({ message: i18nValidationMessage('validation.BOOLEAN') })
  @IsOptional()
  @Transform(({ value }) => {
    return [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1;
  })
  photos?: boolean;
}
