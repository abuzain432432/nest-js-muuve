import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { IpMiddleware } from './common/middlewares/ip.middleware';
import { ExceptionsModule } from './modules/exceptions/exceptions.module';
import { DBModule } from './modules/db/db.module';
import { ConfigModule } from './modules/config/config.module';
import { PropertyModule } from './modules/property/property.module';
import { WSModule } from './modules/ws/ws.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { MessageModule } from './modules/message/message.module';
import { EmailNotificationModule } from './modules/email-notification/email-notification.module';
import { ValidationModule } from './modules/validation/validation.module';
import { EmailModule } from './modules/email/email.module';
import { PaymentModule } from './modules/payment/payment.module';
import { StatsModule } from './modules/stats/stats.module';
import { TourModule } from './modules/tour/tour.module';

@Module({
  imports: [
    ConfigModule,
    ValidationModule,
    ConversationModule,
    MessageModule,
    DBModule,
    AuthModule,
    UsersModule,
    PropertyModule,
    ExceptionsModule,
    WSModule,
    EmailModule,
    EmailNotificationModule,
    PaymentModule,
    StatsModule,
    TourModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpMiddleware).forRoutes('*');
  }
}
