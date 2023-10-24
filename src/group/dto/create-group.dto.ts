import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
  IsEnum,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SchedulesDto } from './schedules.dto';
import { IsInt } from 'class-validator';
import { Degrees } from '../../common/interfaces/degrees';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateGroupDto {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsOptional()
  description?: string = '';

  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ValidateNested({
    each: true,
    message: i18nValidationMessage('validation.ARRAY.OBJECT'),
  })
  @Type(() => SchedulesDto)
  schedules: SchedulesDto[];

  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.DATE.STRING') },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: string;

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  schoolCycle: number;

  @IsEnum(Degrees, { message: i18nValidationMessage('validation.ENUM') })
  degree: Degrees;

  @IsInt({ message: i18nValidationMessage('validation.INT') })
  teacherId: number;
}
