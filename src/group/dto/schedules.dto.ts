import { IsEnum, IsString, Matches } from 'class-validator';
import { Days } from '../../common/interfaces/days';
import { REGEX_HOUR } from '../../common/constants/regex-hourt';

export class SchedulesDto {
  @IsEnum(Days)
  day: Days;

  @IsString()
  @Matches(REGEX_HOUR, { message: 'La hora no es valida' })
  hour: string;
}
