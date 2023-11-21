import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
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
  scheduleL?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  scheduleM?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  scheduleMI?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  scheduleJ?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  scheduleV?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  scheduleS?: string[] = [];

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsEnum(Schedules, {
    each: true,
    message: i18nValidationMessage('validation.ENUM'),
  })
  scheduleD?: string[] = [];

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  schoolCycle: number;

  @IsEnum(Degrees, { message: i18nValidationMessage('validation.ENUM') })
  degree: Degrees;

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  teacherId: number;
}
