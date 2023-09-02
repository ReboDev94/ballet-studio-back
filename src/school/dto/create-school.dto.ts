import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @MinLength(1, { message: 'validation.REQUIRED' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  certifications?: string[];

  @IsString()
  @MinLength(1)
  directorName: string;

  @IsString()
  @IsOptional()
  logo?: string;
}
