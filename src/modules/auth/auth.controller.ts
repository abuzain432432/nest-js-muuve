import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Response } from 'express';
import { SignupDto } from './dtos/signup.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(data, res);
  }

  @Post('/signup')
  signup(@Body() data: SignupDto) {
    return this.authService.signup(data);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getProfile(@Request() req) {
    return { data: req.user };
  }
}
