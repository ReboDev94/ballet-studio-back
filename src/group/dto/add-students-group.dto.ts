import { IsArray, IsInt } from 'class-validator';

export class AddStudentsGroup {
  @IsInt({ each: true })
  @IsArray()
  students: number[];
}
