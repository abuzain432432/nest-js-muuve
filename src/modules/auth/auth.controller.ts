import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CompleteGoogleProfileDto } from './dtos/complete-google-profile-dto';
import { BypassProfileCompleteCheck } from 'src/common/decorators/bypass-profile-complete-check.decorator';
import { IRequest } from 'src/common/types/request.type';
import { BypassUserActiveCheck } from 'src/common/decorators/bypass-user-active-check.decorator';
import { RecoverTfaDto } from './dtos/recover-tfa.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { MESSAGES } from 'src/common/messages/index';
import { LoginSwagger } from './swagger/login.swagger';
import { UserResponseDto } from 'src/common/dtos/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('google/login')
  @ApiBadRequestResponse({
    example: { message: MESSAGES.EMAIL_ASSOCIATED_WITH_OTHER_AUTH_METHOD },
  })
  @UseGuards(GoogleAuthGuard)
  handleLogin() {}

  @Get('google/redirect')
  @ApiExcludeEndpoint()
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Res() res, @Request() req: IRequest) {
    const response = await this.authService.login(req.user);
    const user = req.user;
    if (!user.role) {
      return res.redirect(
        `http://localhost:5173/complete-google-auth?token=${response.token}`,
      );
    }
    res.redirect(`http://localhost:5173?token=${response.token}`);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @LoginSwagger()
  login(@Request() req: IRequest) {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  @ApiCreatedResponse({
    description: 'Success',
    example: { message: MESSAGES.SIGNUP_SUCCESS, token: 'xyz' },
  })
  signup(@Body() data: SignupDto) {
    return this.authService.signup(data);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  @UseGuards(JwtAuthGuard)
  @BypassUserActiveCheck(true)
  @ApiBearerAuth()
  getProfile(@Request() req: IRequest): UserResponseDto {
    return this.authService.getProfile(req.user);
  }

  @Post('/google/complete-profile')
  @BypassProfileCompleteCheck(true)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  @ApiOkResponse({
    description: 'Success',
    example: {
      message: MESSAGES.PROFILE_UPDATED,
    },
  })
  @UseGuards(JwtAuthGuard)
  completeUserProfileCreatedWithGoogleLogin(
    @Body() data: CompleteGoogleProfileDto,
    @Request() req: IRequest,
  ) {
    return this.authService.completeUserProfileCreatedWithGoogleLogin(
      req.user._id,
      data,
    );
  }

  @Get('/qrcode-tfa')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse({
    description: 'Failed',
    example: { message: MESSAGES.TWO_FACTOR_SERVICE_NOT_AVAILABLE },
  })
  @ApiOkResponse({
    description: 'Success',
    example: { url: 'data:image/png;base64,....' },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  async getTfaQrCode(@Request() req: IRequest) {
    const data = await this.authService.generateQrCode(req.user);
    return data;
  }

  @Get('/enable-tfa/:token')
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'Invalid token',
    example: {
      message: MESSAGES.INVALID_OTP_TOKEN,
    },
  })
  @ApiOkResponse({
    description: 'Success',
    example: {
      message: MESSAGES.TWO_FACTOR_ENABLED_SUCCESS,
      recoveryToken: 'xyz',
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  @UseGuards(JwtAuthGuard)
  async enableTfa(@Param('token') token: string, @Request() req: IRequest) {
    return await this.authService.enableTfa(req.user, token);
  }

  @Get('/disable-tfa/:token')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: { message: 'Unauthorized' },
  })
  @ApiBadRequestResponse({
    description: 'Invalid token',
    example: {
      message: MESSAGES.INVALID_OTP_TOKEN,
    },
  })
  @ApiOkResponse({
    description: 'Success',
    example: {
      message: MESSAGES.TWO_FACTOR_DISABLED_SUCCESS,
      recoveryToken: 'xyz',
    },
  })
  @UseGuards(JwtAuthGuard)
  async disableTfa(@Param('token') token: string, @Request() req: IRequest) {
    return await this.authService.disableTfa(req.user, token);
  }

  @Patch('/recover-2fa')
  @ApiBadRequestResponse({
    description: 'Invalid token',
    example: {
      message: MESSAGES.INVALID_OTP_TOKEN,
    },
  })
  @ApiOkResponse({
    description: 'Success',
    example: {
      message: MESSAGES.TWO_FACTOR_DISABLED_SUCCESS,
    },
  })
  async recoverTfa(@Body() data: RecoverTfaDto) {
    return await this.authService.recoverTfa(data.recoveryToken);
  }
  @Get('/activate/:token')
  @ApiOkResponse({
    description: 'Success',
    example: {
      message: MESSAGES.ACCOUNT_ACTIVATED,
    },
  })
  @ApiBadRequestResponse({ example: { message: MESSAGES.INVALID_OTP_TOKEN } })
  activateAccount(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }
}
