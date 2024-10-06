import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EMAIL_NOTIFICATION_QUEUE_NAME } from 'src/common/constants';
import { EmailNotificationConsumer } from './email-notification.consumer';
import { EmailNotificationService } from './email-notification.service';
import { ValidationModule } from 'src/modules/validation/validation.module';
import { ConfigService } from 'src/modules/config/config.service';
import { EmailModule } from 'src/modules/email/email.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: 'redis',
          port: 6379,
        },
        defaultJobOptions: configService.getQueueJobConfigOptions(),
      }),
    }),
    BullModule.registerQueue({
      name: EMAIL_NOTIFICATION_QUEUE_NAME,
    }),
    ValidationModule,
    EmailModule,
  ],
  providers: [EmailNotificationConsumer, EmailNotificationService],
  exports: [EmailNotificationService],
})
export class EmailNotificationModule {}
