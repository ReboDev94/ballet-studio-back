import { Matches, IsDateString } from 'class-validator';

export class RollCallByNameDto {
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;
}
