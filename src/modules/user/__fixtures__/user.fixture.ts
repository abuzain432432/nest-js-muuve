// user-response.fixture.ts

import { UserResponseDto } from 'src/common/dtos/user-response.dto';
import { AuthProvidersEnum } from 'src/common/enums/auth-providers.enum';
import { RolesEnum } from 'src/common/enums/roles.enum';

const baseUser = {
  _id: '60c72b2f9b1d3c001f2e0e55',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: RolesEnum.AGENT,
  provider: AuthProvidersEnum.CUSTOM,
  tfa: true,
  properties: [],
  active: true,
};
export const userFixtures = {
  validUserResponseDto: <UserResponseDto>baseUser,
  inactiveTfaUserResponseDto: <UserResponseDto>{
    ...baseUser,
    tfa: false,
  },
  googleUserResponseDto: <UserResponseDto>{
    ...baseUser,
    provider: AuthProvidersEnum.GOOGLE,
  },
  inactiveUserResponseDto: <UserResponseDto>{
    ...baseUser,
    active: false,
  },

  adminUserResponseDto: <UserResponseDto>{
    ...baseUser,
    role: RolesEnum.ADMIN,
  },
};
