import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "src/modules/auth/auth.service";
import { ConfigService } from "src/modules/config/config.service";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      clientID: configService.get("GOOGLE_AUTH_CLIENT_ID"),
      clientSecret: configService.get("GOOGLE_AUTH_CLIENT_SECRET"),
      callbackURL: configService.get("GOOGLE_AUTH_CALLBACK_URL"),
      scope: ["profile", "email"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      active: true,
    };

    const savedUser = await this.authService.googleLogin(user);
    done(null, { ...savedUser });
  }
}
