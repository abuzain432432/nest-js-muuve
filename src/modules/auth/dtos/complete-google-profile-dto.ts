import { IsEnum } from 'class-validator';
import { RolesEnum } from 'src/common/enums/roles.enum';

import { ExcludeRole } from 'src/common/decorators/exclude-role.decorator';

export class CompleteGoogleProfileDto {
  @IsEnum(RolesEnum, { message: 'Invalid role provided' })
  @ExcludeRole(RolesEnum.ADMIN)
  /**
   * A list of user's roles
   * @example 'admin'
   */
  role: RolesEnum;
}
