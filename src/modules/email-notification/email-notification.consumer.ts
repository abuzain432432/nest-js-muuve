import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';

import * as sgMail from '@sendgrid/mail';
import { Job } from 'bullmq';
import {
  ACTIVATE_ACCOUNT_QUEUE_JOB_NAME,
  EMAIL_NOTIFICATION_QUEUE_NAME,
} from 'src/common/constants';
import { ActivateAccountEmailDto } from 'src/common/dtos/activateAccountEmail.dto';
import { EmailService } from 'src/modules/email/email.service';
// import { EmailTemplateIdsEnum } from 'src/common/enums/email-template-ids.enum';

import { ConfigService } from '../config/config.service';

@Processor(EMAIL_NOTIFICATION_QUEUE_NAME)
export class EmailNotificationConsumer extends WorkerHost {
  constructor(
    private readonly generateEmailTemplateService: EmailService,
    private readonly configService: ConfigService,
  ) {
    super();
    sgMail.setApiKey(configService.get('SEND_GRID_API_KEY'));
  }
  async sendMail(
    to: string,
    subject: string,
    text?: string,
    html?: string,
    headers?: any,
  ) {
    const msg = {
      // NOTE add check if current environment is not production then send to the mailosaur email address but for now we don't have the mailosaur account
      // to: this.configService.get('MAILOSAUR_EMAIL'),
      to,
      from: this.configService.get('SENDER_EMAIL'),
      subject,
      text,
      html,
      headers,
    };
    console.log('++++++++++++++++++++++++++');
    console.log(msg);

    // await sgMail.send(msg);
    return { success: true };
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
    // const template = await this.generateEmailTemplateService.getEmailTemplate(
    //   { templateId: EmailTemplateIdsEnum.ActivateAccount },
    //   data,
    // );
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
    console.log(data);
    // const template = {
    //   subject: `Activate Account for ${data.email}`,
    //   html: `<p>Use this otp to activate your account <span class="otpCode">${data.otp}</span></p> `,
    // };
    // await this.sendMail(data.email, template.subject, undefined, template.html);
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
