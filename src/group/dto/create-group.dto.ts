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

export class CreateGroupDto {
  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  description?: string = '';

  @IsArray({ message: 'validation.IS_ARRAY' })
  @ValidateNested({ each: true, message: 'validation.ARRAY.OBJECT' })
  @Type(() => SchedulesDto)
  schedules: SchedulesDto[];

  @IsDateString({}, { message: 'validation.DATE.STRING' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: string;

  @IsInt({ message: 'validation.INT' })
  schoolCycle: number;

  @IsEnum(Degrees, { message: 'validation.ENUM' })
  degree: Degrees;

  @IsInt({ message: 'validation.INT' })
  teacherId: number;
}
