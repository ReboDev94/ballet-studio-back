import { PartialType } from '@nestjs/mapped-types';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Degrees } from 'src/common/interfaces/degrees';
import { IsEnum, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchGroupDto extends PartialType(PageOptionsDto) {
  @IsEnum(Degrees)
  @IsOptional()
  degree?: Degrees;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  teacher?: number;
}
