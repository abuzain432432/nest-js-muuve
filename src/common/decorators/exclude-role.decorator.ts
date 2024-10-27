import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RolesEnum } from 'src/common/enums/roles.enum';

@ValidatorConstraint({ name: 'excludeRole', async: false })
class ExcludeRoleConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    const { excludedRole } = args.constraints[0];
    return value !== excludedRole;
  }

  defaultMessage(args: any) {
    const { excludedRole } = args.constraints[0];
    return `${excludedRole} role is not allowed`;
  }
}

export function ExcludeRole(
  excludedRole: RolesEnum,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'excludeRole',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [{ excludedRole }],
      validator: ExcludeRoleConstraint,
    });
  };
}
