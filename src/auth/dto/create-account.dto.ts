import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  userName: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @MinLength(1)
  nameSchool: string;
}
