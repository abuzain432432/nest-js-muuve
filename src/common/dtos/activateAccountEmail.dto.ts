import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ActivateAccountEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
