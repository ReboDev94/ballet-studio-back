import { PartialType } from '@nestjs/mapped-types';
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

export class SearchUserDto extends PartialType(PageOptionsDto) {
  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray({ message: 'validation.IS_ARRAY' })
  @IsEnum(ValidRoles, { each: true, message: 'validation.ENUM' })
  @Type(() => String)
  @Transform(({ value }: { value: string }) => value.split(','))
  roles?: ValidRoles[];

  @IsBoolean({ message: 'validation.BOOLEAN' })
  @IsOptional()
  @Transform(({ value }) => {
    return [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1;
  })
  photos?: boolean;
}
