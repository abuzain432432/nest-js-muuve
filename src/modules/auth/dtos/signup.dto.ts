import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
import { Transform } from 'class-transformer';

export class SignupDto {
  @MinLength(3, { message: 'First name must be at least 3 characters long' })
  @IsString({ message: 'First Name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @MinLength(3, { message: 'Last name must be at least 3 characters long' })
  @IsString({ message: 'Last Name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Match('password', { message: 'Password and Confirm password do not match' })
  @IsString({ message: 'Password Confirm must be a string' })
  @MinLength(8, {
    message: 'Password Confirm must be at least 8 characters long',
  })
  @IsNotEmpty({ message: 'Password Confirm is required' })
  passwordConfirm: string;
}
