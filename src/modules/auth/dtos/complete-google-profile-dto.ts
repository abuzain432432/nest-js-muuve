import { IsEnum } from 'class-validator';
import { RolesEnum } from 'src/common/enums/roles.enum';
// TODO will need to enable docs for this module
export class CompleteGoogleProfileDto {
  /**
   * The user's role
   * @example 'agent'
   */

  @IsEnum(RolesEnum, { message: 'Invalid role provided' })
  role: RolesEnum;
}
