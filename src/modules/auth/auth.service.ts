import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { ConfigService } from '../config/config.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  private setAuthCookie(res: Response, token: string) {
    const jwtCookieExpiryTime = this.configService.getJwtCookieExpiryTime();

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      signed: true,
      expires: jwtCookieExpiryTime,
    });
  }

  async login(data: LoginDto, res: Response) {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      throw new NotFoundException(
        "We couldn't find an account with the email address you provided.",
      );
    }
    const { password, ...userDetails } = user.toObject();
    const isPasswordMatched = await user.correctPassword(
      data.password,
      password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = await this.jwtService.signAsync({ sub: userDetails.id });
    this.setAuthCookie(res, token);
    return { message: 'Login successful', data: userDetails };
  }
  async signup(data: SignupDto) {
    const newlyCreatedUser = await this.userService.create(data as any);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userDetails } = newlyCreatedUser.toObject();
    return { message: 'Signup successful' };
  }
}
