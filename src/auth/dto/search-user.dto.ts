import { PartialType } from '@nestjs/mapped-types';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ValidRoles } from '../interfaces/valid-roles';

export class SearchUserDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ValidRoles)
  @IsOptional()
  role?: ValidRoles;
}
