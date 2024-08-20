import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  login(data: LoginDto) {
    const user = this.userService.findOneByEmail(data.email);
    console.log('USER __________________________');
    console.log(user);
    if (!user) {
      throw new NotFoundException(
        "We couldn't find an account with the email address you provided.",
      );
    }
    return { message: 'Login successful' };
  }
  signup() {
    return { message: 'Signup successful' };
  }
}
