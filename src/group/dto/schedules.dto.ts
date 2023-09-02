import { IsEnum, IsString, Matches } from 'class-validator';
import { Days } from '../../common/interfaces/days';
import { REGEX_HOUR } from '../../common/constants/regex-hourt';

export class SchedulesDto {
  @IsEnum(Days, { message: 'validation.ENUM' })
  day: Days;

  @IsString({ message: 'validation.STRING' })
  @Matches(REGEX_HOUR, { message: 'validation.HOUR' })
  hour: string;
}
