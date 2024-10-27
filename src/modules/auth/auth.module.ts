import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { ConfigService } from "src/modules/config/config.service";
import { EmailNotificationModule } from "src/modules/email-notification/email-notification.module";
import { UsersModule } from "src/modules/user/user.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./strategies/google-strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  exports: [AuthService],
  controllers: [AuthController],
  providers: [GoogleStrategy, AuthService, LocalStrategy, JwtStrategy],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.getJwtExpiryString(),
        },
      }),
      global: true,
    }),
    UsersModule,
    EmailNotificationModule,
  ],
})
export class AuthModule {}
