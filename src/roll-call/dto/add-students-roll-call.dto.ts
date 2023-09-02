import {
  IsDateString,
  Matches,
  IsInt,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class AddStudentsToRollCallDto {
  @IsDateString({}, { message: 'validation.DATE.STRING' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @IsInt({ each: true, message: 'validation.ARRAY.INT' })
  @IsArray({ message: 'validation.IS_ARRAY' })
  @ArrayNotEmpty({ message: 'validation.ARRAY.NOT_EMPTY' })
  groupStudentsIds: number[];
}
