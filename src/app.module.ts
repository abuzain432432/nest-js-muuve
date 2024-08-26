import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { IpMiddleware } from './common/middlewares/ip.middleware';
import { ExceptionsModule } from './modules/exceptions/exceptions.module';
import { DBModule } from './modules/db/db.module';
import { ConfigModule } from './modules/config/config.module';
import { PropertyModule } from './modules/property/property.module';
import { WSModule } from './modules/ws/ws.module';

@Module({
  imports: [
    ConfigModule,
    DBModule,
    AuthModule,
    UsersModule,
    PropertyModule,
    ExceptionsModule,
    WSModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpMiddleware).forRoutes('*');
  }
}
