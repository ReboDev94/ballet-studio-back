import { PartialType } from '@nestjs/mapped-types';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { IsOptional, IsString } from 'class-validator';

export class SearcStudenthDto extends PartialType(PageOptionsDto) {
  @IsString()
  @IsOptional()
  name?: string;
}
