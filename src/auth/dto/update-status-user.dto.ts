import { IsBoolean } from 'class-validator';

export class UpdateStatusUserDto {
  @IsBoolean({ message: 'validation.BOOLEAN' })
  status: boolean;
}
