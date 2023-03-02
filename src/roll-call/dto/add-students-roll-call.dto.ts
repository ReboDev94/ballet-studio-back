import {
  IsDateString,
  Matches,
  IsInt,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class AddStudentsToRollCallDto {
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @IsInt({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  groupStudentsIds: number[];
}
