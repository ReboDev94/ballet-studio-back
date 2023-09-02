import { IsArray, IsInt } from 'class-validator';

export class AddOrRemoveStudentsGroupDto {
  @IsInt({ each: true, message: 'valitation.ARRAY.INT' })
  @IsArray({ message: 'validation.IS_ARRAY' })
  students: number[];
}
