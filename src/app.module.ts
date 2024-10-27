import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

import { IpMiddleware } from "./common/middlewares/ip.middleware";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "./modules/config/config.module";
import { ConversationModule } from "./modules/conversation/conversation.module";
import { DBModule } from "./modules/db/db.module";
import { EmailModule } from "./modules/email/email.module";
import { EmailNotificationModule } from "./modules/email-notification/email-notification.module";
import { ExceptionsModule } from "./modules/exceptions/exceptions.module";
import { MessageModule } from "./modules/message/message.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { PropertyModule } from "./modules/property/property.module";
import { StatsModule } from "./modules/stats/stats.module";
import { TourModule } from "./modules/tour/tour.module";
import { UsersModule } from "./modules/user/user.module";
import { ValidationModule } from "./modules/validation/validation.module";
import { WSModule } from "./modules/ws/ws.module";

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
    consumer.apply(IpMiddleware).forRoutes("*");
  }
}
