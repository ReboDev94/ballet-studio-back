import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PageMetaDto } from './page-meta.dto';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PageDto<T> {
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  readonly data: T[];

  @Type(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
