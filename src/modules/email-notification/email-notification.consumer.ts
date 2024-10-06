import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import {
  ACTIVATE_ACCOUNT_QUEUE_JOB_NAME,
  EMAIL_NOTIFICATION_QUEUE_NAME,
} from 'src/common/constants';
import { Job } from 'bullmq';
import { EmailService } from 'src/modules/email/email.service';
import { EmailTemplateIdsEnum } from 'src/common/enums/email-template-ids.enum';
import { ActivateAccountEmailDto } from 'src/common/dtos/activateAccountEmail.dto';

@Processor(EMAIL_NOTIFICATION_QUEUE_NAME)
export class EmailNotificationConsumer extends WorkerHost {
  constructor(private readonly generateEmailTemplateService: EmailService) {
    super();
  }
  async process(job: Job<any, any, string>) {
    try {
      switch (job.name) {
        case ACTIVATE_ACCOUNT_QUEUE_JOB_NAME:
          return this.processActivateAccount(job.data);
        default:
          throw new Error('Unknown job name');
      }
    } catch (error) {
      //NOTE  Ensure the error is propagated for the @OnWorkerEvent handler
      throw error;
    }
  }
  @OnWorkerEvent('failed')
  onFail(job: Job) {
    return this.onJobFail(job);
  }

  async processActivateAccount(data: ActivateAccountEmailDto) {
    const template = await this.generateEmailTemplateService.getEmailTemplate(
      { templateId: EmailTemplateIdsEnum.ActivateAccount },
      data,
    );
    console.log(template);
  }
  /**
   * This method is called when a job fails
   * to be noted that it will also handle the case for unknown job
   **/
  onJobFail(job: Job) {
    // TODO use the logger service to log the errors and send the errors to the sentry and hence to slack channel and use data, error.message to log the error
    console.log('++++++++++++++++++++++++++++++++++++++++++');
    console.log('ATTEMPT NO', job.attemptsMade);
    console.error('JOB Name', job.name);
    console.log('JOB DATA', job.data);
    console.error('Error Message:', job.failedReason); // The error message
    // console.error('Error Stack:', job.stacktrace); // The error stack trace (if available)
  }
}
