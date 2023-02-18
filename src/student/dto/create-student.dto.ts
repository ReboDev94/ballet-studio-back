import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  address: string;

  @IsBoolean()
  @Transform(
    ({ value }) => [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1,
  )
  isOlder: boolean;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  dieseses?: string[];

  @ValidateIf((o) => !o.isOlder)
  @IsString()
  @MinLength(1)
  tutorName?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  tutorEmail?: string;

  @IsString()
  @IsOptional()
  tutorPhone: string;

  @IsString()
  tutorCelPhone: string;

  // @IsBoolean()
  // @IsOptional()
  // tutorAuthorizePhotos: boolean;
}