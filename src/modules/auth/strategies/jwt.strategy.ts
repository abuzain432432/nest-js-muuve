import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "src/modules/config/config.service";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    const tokenSecret = configService.get("JWT_SECRET");
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: tokenSecret,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const user = await this.userService.findOneById(userId);
    // suppose token is valid but user no longer exists in the database
    if (!user) {
      return null;
    }
    return user.toObject();
  }
}
