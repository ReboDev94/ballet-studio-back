import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../constants/pagination';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PageOptionsDto {
  @IsEnum(Order, { message: i18nValidationMessage('validation.ENUM') })
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.INT') })
  @Min(1, { message: i18nValidationMessage('validation.MIN.INT') })
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.INT') })
  @Min(1, { message: i18nValidationMessage('validation.MIN.INT') })
  @Max(50, { message: i18nValidationMessage('validation.MAX.INT') })
  @IsOptional()
  readonly take?: number = 15;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
