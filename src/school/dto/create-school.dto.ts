import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSchoolDto {
  @IsString({ message: 'validation.STRING' })
  @MinLength(1, { message: 'validation.MIN.STRING' })
  name: string;

  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  address?: string;

  @IsString({ each: true, message: 'validation.ARRAY.STRING' })
  @IsArray({ message: 'validation.IS_ARRAY' })
  @IsOptional()
  certifications?: string[];

  @IsString({ message: 'validation.STRING' })
  @MinLength(1, { message: 'validation.MIN.STRING' })
  directorName: string;
}
