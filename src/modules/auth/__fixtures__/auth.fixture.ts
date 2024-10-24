import { RolesEnum } from 'src/common/enums/roles.enum';
import { SignupDto } from '../dtos/signup.dto';
const baseSignupUser = {
  email: 'dummy@gmail.com',
  password: 'password',
  firstName: 'Dummy',
  role: RolesEnum.AGENT,
  lastName: 'User',
  passwordConfirm: 'password',
};
export const signupFixtures = {
  validSignupDto: <SignupDto>baseSignupUser,

  invalidSignupDto: <SignupDto>{
    ...baseSignupUser,
    email: '',
  },
  duplicateEmailSignupDto: <SignupDto>{
    ...baseSignupUser,
    email: 'duplicate@example.com',
  },
};
