import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from 'src/modules/config/config.service';
import { UserService } from 'src/modules/user/user.service';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException('Please login to get access');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const user = await this.userService.findOneById(payload.sub);
      if (!user) {
        this.deleteAuthCookie(response);
        throw new UnauthorizedException(
          'Your account is deleted. Please contact our support team',
        );
      }
      request['user'] = user;
    } catch {
      throw new UnauthorizedException('Please login to get access');
    }
    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    return request.signedCookies['auth_token'];
  }

  private deleteAuthCookie(response: Response) {
    response.clearCookie('auth_token', {
      httpOnly: true,
      secure: true,
      signed: true,
    });
  }
}
