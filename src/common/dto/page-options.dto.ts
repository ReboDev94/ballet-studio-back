import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Order } from '../constants/pagination';

export class PageOptionsDto {
  @IsEnum(Order, { message: 'validation.ENUM' })
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt({ message: 'validation.INT' })
  @Min(1, { message: 'validation.MIN.INT' })
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt({ message: 'validation.INT' })
  @Min(1, { message: 'validation.MIN.INT' })
  @Max(50, { message: 'validation.MAX.INT' })
  @IsOptional()
  readonly take?: number = 15;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
