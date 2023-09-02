import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @IsArray({ message: 'validation.IS_ARRAY' })
  readonly data: T[];

  @Type(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
