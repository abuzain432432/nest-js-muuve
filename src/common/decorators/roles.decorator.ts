import { Reflector } from '@nestjs/core';
import { RolesEnum } from 'src/common/enums/roles.enum';
/**
 * This decorator is used to define the role required to execute a handler
 * or to get the list of required roles for a decorator
 **/
export const Roles = Reflector.createDecorator<RolesEnum[]>();
