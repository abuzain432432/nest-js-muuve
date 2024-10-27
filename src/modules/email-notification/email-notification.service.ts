import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";

import { Queue } from "bullmq";
import {
  ACTIVATE_ACCOUNT_QUEUE_JOB_NAME,
  EMAIL_NOTIFICATION_QUEUE_NAME,
} from "src/common/constants";
import { ActivateAccountEmailDto } from "src/common/dtos/activateAccountEmail.dto";
import { ValidationService } from "src/modules/validation/validation.service";

@Injectable()
export class EmailNotificationService {
  constructor(
    @InjectQueue(EMAIL_NOTIFICATION_QUEUE_NAME)
    private emailNotificationQueue: Queue,
    private validationService: ValidationService,
  ) {}

  async sendActivateAccountEmail(data: ActivateAccountEmailDto) {
    await this.validationService.validateDto(ActivateAccountEmailDto, {
      ...data,
    });
    console.log("############# SEND ACTIVATE ACCOUNT EMAIL ##############");
    console.log(data);
    this.emailNotificationQueue.add(ACTIVATE_ACCOUNT_QUEUE_JOB_NAME, data);
  }
}
