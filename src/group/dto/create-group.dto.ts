import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
  IsEnum,
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
  startDate: Date;

  @IsInt()
  schoolCycle: number;

  @IsEnum(Degrees)
  degree: Degrees;

  @IsInt()
  teacherId: number;
}
