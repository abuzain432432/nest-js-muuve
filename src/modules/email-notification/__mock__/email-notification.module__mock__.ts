import { Module } from "@nestjs/common";

import { EmailNotificationService } from "src/modules/email-notification/email-notification.service";

@Module({
  providers: [
    {
      provide: EmailNotificationService,
      useValue: {
        sendActivateAccountEmail: jest.fn().mockResolvedValue(undefined),
      },
    },
  ],
  exports: [EmailNotificationService],
})
export default class EmailNotificationModule__Mock__ {}
