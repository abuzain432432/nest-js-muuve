import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private matchRoles(roles: RolesEnum[], userRole: RolesEnum): boolean {
    return roles.some((role) => role === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<undefined | RolesEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request?.user?.role as RolesEnum;

    if (!this.matchRoles(roles, userRole)) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }
    return true;
  }
}
