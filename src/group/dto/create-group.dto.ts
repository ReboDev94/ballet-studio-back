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
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SchedulesDto)
  schedules: SchedulesDto[];

  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: string;

  @IsInt()
  schoolCycle: number;

  @IsEnum(Degrees)
  degree: Degrees;

  @IsInt()
  teacherId: number;
}
