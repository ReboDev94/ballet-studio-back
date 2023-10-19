import { IsEmail, IsString, IsObject } from 'class-validator';

export class createMailDto {
  @IsString({ message: 'validation.STRING' })
  @IsEmail({}, { message: 'validation.EMAIL' })
  to: string;

  @IsString({ message: 'validation.STRING' })
  subject: string;

  @IsString({ message: 'validation.STRING' })
  template: string;

  @IsObject({ message: 'validation.IS_OBJECT' })
  context: object;
}
