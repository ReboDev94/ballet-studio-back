import { IsArray, IsInt } from 'class-validator';

export class AddOrRemoveStudentsGroup {
  @IsInt({ each: true })
  @IsArray()
  students: number[];
}
