import { IsArray, IsInt } from 'class-validator';

export class AddOrRemoveStudentsGroupDto {
  @IsInt({ each: true })
  @IsArray()
  students: number[];
}
