import {
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsOlder } from './../../common/utils/is-older';

export class CreateStudentDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dateOfBirth: string;

  @IsString()
  address: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  dieseses?: string[];

  @ValidateIf((o) => {
    if (!o.dateOfBirth) return true;
    return !IsOlder(o.dateOfBirth);
  })
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
