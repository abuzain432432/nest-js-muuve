import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { HasActiveSubscription } from 'src/common/decorators/has-active-subscription.decorator';
import { IUser } from 'src/common/types/user.type';
import { IRequest } from 'src/common/types/request.type';

@Injectable()
export class ActiveSubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const shouldValidateForSubscription = this.reflector.getAllAndOverride<
      undefined | RolesEnum[]
    >(HasActiveSubscription, [context.getHandler(), context.getClass()]);

    if (!shouldValidateForSubscription) {
      return true;
    }

    const request = context.switchToHttp().getRequest<IRequest>();
    const user = request.user as IUser;
    if (user.role !== RolesEnum.AGENT) {
      return true;
    }
    if (
      user.subscriptionId &&
      user.invoiceStatus === 'paid' &&
      user.subscriptionStatus === 'active'
    ) {
      return true;
    }
    throw new ForbiddenException('You are not allowed to perform this action');
  }
}
