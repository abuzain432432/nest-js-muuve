import {
  Injectable,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/modules/auth/auth.service';
import { IRequest } from 'src/common/types/request.type';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = await super.canActivate(context);
    if (!activate) {
      return false;
    }

    const request = context.switchToHttp().getRequest<IRequest>();
    const user = request.user;

    if (user.tfa) {
      const otp = request.body.otp;
      if (!otp) {
        throw new HttpException('2FA token required', HttpStatus.FORBIDDEN);
      }

      const isValid = this.authService.verifyMfaToken(user.tfaSecret, otp);
      if (!isValid) {
        throw new HttpException('Invalid 2FA token', HttpStatus.FORBIDDEN);
      }
    }
    return true;
  }
}
