import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as crypto from 'crypto';
import { Request } from 'express';
import { SignupDto } from './dtos/signup.dto';
import { CompleteGoogleProfileDto } from './dtos/complete-google-profile-dto';
import { UserService } from 'src/modules/user/user.service';
import { ConfigService } from 'src/modules/config/config.service';
import { AuthPayloadType } from 'src/common/types/auth.types';
import { AuthProvidersEnum } from 'src/common/enums/auth-providers.enum';
import { EmailNotificationService } from 'src/modules/email-notification/email-notification.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { IUser } from 'src/common/types/user.type';
import { MESSAGES } from 'src/common/messages/index';
import { createHashVerifier } from 'src/common/lib/en-decryption.lib';
import { v4 as uuidv4 } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/common/dtos/user-response.dto';
import { transformToDto } from 'src/common/lib/transform-to-dto.lib';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailNotificationService: EmailNotificationService,
  ) {}
  extractTokenFromRequest(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return request.signedCookies['auth_token'];
  }

  async validateTokenAndGetUser(token: string) {
    const userId = await this.validateTokenAndGetId(token);
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return plainToInstance(UserResponseDto, user.toObject());
  }
  async completeUserProfileCreatedWithGoogleLogin(
    userId: string,
    data: CompleteGoogleProfileDto,
  ) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.userService.update(userId, {
      ...data,
    });
    return { message: MESSAGES.PROFILE_UPDATED };
  }
  private async validateTokenAndGetId(token: string) {
    const payload = await this.jwtService.verifyAsync<AuthPayloadType>(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return payload.sub;
  }

  deleteAuthCookie(response: Response) {
    response.clearCookie('auth_token', {
      httpOnly: true,
      secure: true,
      signed: true,
    });
  }

  // Method to set authentication cookie
  setAuthCookie(res: Response, token: string) {
    const jwtCookieExpiryTime = this.configService.getJwtCookieExpiryTime();
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      signed: true,
      expires: jwtCookieExpiryTime,
    });
  }
  async login(user: IUser) {
    const token = await this.jwtService.signAsync({ sub: user._id });
    const result = transformToDto(UserResponseDto, user);
    return {
      token,
      user: result,
    };
  }

  createOtp = async function () {
    const otpToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    const hashedOtp = createHashVerifier(otpToken);
    const otpExpiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
    return { otpToken, hashedOtp, otpExpiresAt };
  };

  async signup(data: SignupDto) {
    const { hashedOtp, otpExpiresAt, otpToken } = await this.createOtp();
    const newlyCreatedUser = await this.userService.create({
      ...data,
      otp: hashedOtp,
      otpExpiresAt,
      provider: AuthProvidersEnum.CUSTOM,
      activate: false,
    } as any);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ...userDetails } = newlyCreatedUser.toObject();
    await this.emailNotificationService.sendActivateAccountEmail({
      firstName: userDetails.firstName,
      email: userDetails.email,
      otp: otpToken,
    });
    const token = await this.jwtService.signAsync({ sub: userDetails._id });
    return {
      message: MESSAGES.SIGNUP_SUCCESS,
      token,
    };
  }
  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordMatched = await user.correctPassword(pass, user.password);
    if (isPasswordMatched) {
      return transformToDto(UserResponseDto, user.toObject());
    }
    return null;
  }
  async googleLogin(userData: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const user = await this.userService.findOneByEmail(userData.email);
    if (!user) {
      return await this.userService.create(
        {
          ...userData,
          provider: AuthProvidersEnum.GOOGLE,
        } as any,
        { validateBeforeSave: false },
      );
    }
    if (user.provider !== AuthProvidersEnum.GOOGLE) {
      throw new BadRequestException(
        MESSAGES.EMAIL_ASSOCIATED_WITH_OTHER_AUTH_METHOD,
      );
    }
    return transformToDto(UserResponseDto, user.toObject());
  }

  async activateAccount(token: string) {
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log(token);
    const hashedToken = await createHashVerifier(token);
    const user = await this.userService.findOneByOtp(hashedToken);
    user.active = true;
    await user.save();
    //TODO send an email to the user that the account is activated successfully
    return { message: MESSAGES.ACCOUNT_ACTIVATED };
  }

  async generateQrCode(user: IUser) {
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log(user);
    // TODO will need to rethink this logic
    if (user.provider !== AuthProvidersEnum.CUSTOM) {
      throw new BadRequestException(MESSAGES.TWO_FACTOR_SERVICE_NOT_AVAILABLE);
    }
    if (user.tfa) {
      throw new BadRequestException(MESSAGES.ALREADY_TFA_ENABLED);
    }
    const secret = speakeasy.generateSecret({
      name: `Muuve (${user.email})`,
      length: 20,
    });

    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `Muuve (${user.email})`,
      encoding: 'base32',
    });

    await this.userService.saveTfaSecret(user._id, secret.base32);
    return { url: (await qrcode.toDataURL(otpAuthUrl)) as string };
  }
  verifyMfaToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({ secret, encoding: 'base32', token });
  }
  async enableTfa(user: IUser, token: string) {
    // TODO will need to send an email to the user with the recovery token
    if (user.tfa) {
      throw new BadRequestException(MESSAGES.ALREADY_TFA_ENABLED);
    }
    const isValid = this.verifyMfaToken(user.tfaSecret, token);
    if (!isValid) {
      throw new BadRequestException(MESSAGES.INVALID_OTP_TOKEN);
    }
    const recoveryToken = uuidv4();
    const hashedRecoveryToken = createHashVerifier(recoveryToken);
    await this.userService.update(user._id, {
      tfa: true,
      tfaRecoveryToken: hashedRecoveryToken,
    });

    return { message: MESSAGES.TWO_FACTOR_ENABLED_SUCCESS, recoveryToken };
  }
  async disableTfa(user: IUser, token: string) {
    // TODO will need to send  confirmation email to the user
    if (!user.tfa) {
      throw new BadRequestException(MESSAGES.ALREADY_TFA_DISABLED);
    }
    const isValid = this.verifyMfaToken(user.tfaSecret, token);
    if (!isValid) {
      throw new BadRequestException(MESSAGES.INVALID_OTP_TOKEN);
    }
    await this.userService.update(user._id, { tfa: false, tfaSecret: '' });
    return { message: MESSAGES.TWO_FACTOR_DISABLED_SUCCESS };
  }

  async recoverTfa(recoveryToken: string) {
    // TODO will need to send  confirmation email to the user

    const hashedRecoveryToken = createHashVerifier(recoveryToken);
    await this.userService.findUserByTfaRecoveryToken(hashedRecoveryToken);
    return { message: MESSAGES.TWO_FACTOR_DISABLED_SUCCESS };
  }
  getProfile(user: IUser) {
    return transformToDto(UserResponseDto, user);
  }
}
