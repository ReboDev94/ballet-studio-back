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
  @IsString({ message: 'validation.STRING' })
  @MinLength(1, { message: 'validation.MIN.STRING' })
  name: string;

  @IsDateString({}, { message: 'validation.DATE.STRING' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  dateOfBirth: string;

  @IsString({ message: 'validation.STRING' })
  address: string;

  @IsString({ each: true, message: 'validation.ARRAY.STRING' })
  @IsArray({ message: 'validation.IS_ARRAY' })
  @IsOptional()
  dieseses?: string[];

  @ValidateIf((o) => {
    if (!o.dateOfBirth) return true;
    return !IsOlder(o.dateOfBirth);
  })
  @IsString({ message: 'validation.STRING' })
  @MinLength(1, { message: 'validation.MIN.STRING' })
  tutorName?: string;

  @IsString({ message: 'validation.STRING' })
  @IsEmail({}, { message: 'validation.EMAIL' })
  @IsOptional()
  tutorEmail?: string;

  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  tutorPhone: string;

  @IsString({ message: 'validation.STRING' })
  tutorCelPhone: string;

  // @IsBoolean()
  // @IsOptional()
  // tutorAuthorizePhotos: boolean;
}
