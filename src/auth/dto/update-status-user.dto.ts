import { IsBoolean } from 'class-validator';

export class UpdateStatusUserDto {
  @IsBoolean()
  status: boolean;
}
