import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
  @Post('/signup')
  signup(@Body() data: LoginDto) {
    console.log(data);
    return this.authService.signup();
  }
}
