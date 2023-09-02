import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class ChangeAttendedDto {
  @IsBoolean({ message: 'validation.BOOLEAN' })
  @Transform(
    ({ value }) => [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1,
  )
  attended: boolean;
}
