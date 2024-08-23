import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
import { String } from 'src/common/decorators/string.decorator';

export class SignupDto {
  @String({
    minLength: 3,
    isStringMessage: 'First Name must be a string',
    isNotEmptyMessage: 'First name is required',
    minLengthMessage: 'First name must be at least 3 characters long',
  })
  firstName: string;

  @String({
    minLength: 3,
    isStringMessage: 'Last Name must be a string',
    isNotEmptyMessage: 'Last name is required',
    minLengthMessage: 'Last name must be at least 3 characters long',
  })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8)
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Match('password', { message: 'Password and Confirm password do not match' })
  @IsString({ message: 'Password Confirm must be a string' })
  @MinLength(8)
  @IsNotEmpty({ message: 'Password Confirm is required' })
  passwordConfirm: string;
}
