import { PartialType } from '@nestjs/mapped-types';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { IsOptional, IsString } from 'class-validator';

export class SearchStudenthDto extends PartialType(PageOptionsDto) {
  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  name?: string;
}
