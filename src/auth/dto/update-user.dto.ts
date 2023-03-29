import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @IsOptional()
  phone: string;
}
