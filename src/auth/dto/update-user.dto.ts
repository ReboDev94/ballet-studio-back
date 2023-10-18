import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'validation.STRING' })
  @MinLength(1, { message: 'validation.MIN.STRING' })
  name: string;

  @IsString({ message: 'validation.STRING' })
  @IsOptional()
  phone: string;

  @IsString({ message: 'validation.STRING' })
  @IsEmail({}, { message: 'validation.EMAIL' })
  email: string;

  // @IsString({ message: 'validation.STRING' })
  // @IsOptional()
  // photo: string | null;
}
