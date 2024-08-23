import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { RolesEnum } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private matchRoles(roles: RolesEnum[], userRole: RolesEnum) {
    return roles.some((rl) => rl === userRole);
    // return true;
  }
  canActivate(context: ExecutionContext): boolean {
    // TODO update this code to check for the roles assigned on both class level and method level
    const roles = this.reflector.get<undefined | RolesEnum[]>(
      Roles,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // TODO remove the optional chaining here after implementing authorization
    const userRole = request?.user?.role as RolesEnum;
    return this.matchRoles(roles, userRole);
  }
}
