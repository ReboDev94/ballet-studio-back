import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Degrees } from '../../common/interfaces/degrees';
import { Schedules } from 'src/common/interfaces/schedules';

export class CreateGroupDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  name: string;

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  @ArrayUnique({ message: 'validation.ARRAY.UNIQUE' })
  scheduleL?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  @ArrayUnique({ message: 'validation.ARRAY.UNIQUE' })
  scheduleM?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  @ArrayUnique({ message: 'validation.ARRAY.UNIQUE' })
  scheduleMI?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  @ArrayUnique({ message: 'validation.ARRAY.UNIQUE' })
  scheduleJ?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  @ArrayUnique({ message: 'validation.ARRAY.UNIQUE' })
  scheduleV?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  @ArrayUnique({ message: 'validation.ARRAY.UNIQUE' })
  scheduleS?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  @ArrayUnique({ message: 'validation.ARRAY.UNIQUE' })
  scheduleD?: string[] = [];

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  schoolCycle: number;

  @IsEnum(Degrees, { message: i18nValidationMessage('validation.ENUM') })
  degree: Degrees;

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  teacherId: number;
}
