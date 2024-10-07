import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthProvidersEnum } from 'src/common/enums/auth-providers.enum';
import { IncompleteProfileException } from 'src/common/exceptions/incomplete-profile.exception';
import { Reflector } from '@nestjs/core';
import { BypassProfileCompleteCheck } from 'src/common/decorators/bypass-profile-complete-check.decorator';
import { IRequest } from 'src/common/types/request.type';
import { BypassUserActiveCheck } from 'src/common/decorators/bypass-user-active-check.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequest>();
    // Perform default JWT authentication first
    const canActivate = (await super.canActivate(context)) as boolean;

    if (!canActivate) return false;
    const user = request.user;

    const bypassUserActiveCheck = this.reflector.get<boolean>(
      BypassUserActiveCheck,
      context.getHandler(),
    );
    if (!bypassUserActiveCheck && !user.active) {
      return false;
    }

    // this is the custom logic to check if the user has a complete profile
    const bypassProfileCompleteCheck = this.reflector.get<boolean>(
      BypassProfileCompleteCheck,
      context.getHandler(),
    );
    if (bypassProfileCompleteCheck) {
      return true;
    }
    if (user.provider === AuthProvidersEnum.GOOGLE && !user.role) {
      throw new IncompleteProfileException();
    }
    return true;
  }
}
