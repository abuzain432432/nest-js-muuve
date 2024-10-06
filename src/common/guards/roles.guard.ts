import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MESSAGES } from 'src/common/messages';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private matchRoles(roles: RolesEnum[], userRole: RolesEnum): boolean {
    return roles.some((role) => role === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<undefined | RolesEnum[]>(
      Roles,
      [context.getHandler(), context.getClass()],
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request?.user?.role as RolesEnum;

    if (!this.matchRoles(roles, userRole)) {
      throw new ForbiddenException(MESSAGES.ACTION_NOT_ALLOWED);
    }
    return true;
  }
}
