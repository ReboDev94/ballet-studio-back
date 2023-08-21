import { PartialType } from '@nestjs/mapped-types';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ValidRoles } from '../interfaces/valid-roles';
import { Transform } from 'class-transformer';

export class SearchUserDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ValidRoles)
  @IsOptional()
  role?: ValidRoles;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    return [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1;
  })
  photos?: boolean;
}
