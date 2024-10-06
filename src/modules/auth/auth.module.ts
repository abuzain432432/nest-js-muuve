import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/modules/config/config.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google-strategy';
import { EmailNotificationModule } from 'src/modules/email-notification/email-notification.module';

@Module({
  exports: [AuthService],
  controllers: [AuthController],
  providers: [GoogleStrategy, AuthService, LocalStrategy, JwtStrategy],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
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
