import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse, AxiosError, isAxiosError } from 'axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EmailTemplateIdsEnum } from 'src/common/enums/email-template-ids.enum';
import { ConfigService } from 'src/modules/config/config.service';

type EmailGenerateTemplateError = { message: string; error: any };

@Injectable()
export class EmailService {
  private defaultErrorMessage =
    'An error occurred while generating the email template';

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.httpService.axiosRef.defaults.baseURL = this.configService.get(
      'FRONTEND_EMAIL_SERVICE_URL',
    );
  }

  async getEmailTemplate(
    {
      templateId,
      htmlOnly,
    }: { templateId: EmailTemplateIdsEnum; htmlOnly?: boolean },
    date: any,
  ): Promise<any> {
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(templateId, {
          params: { date, htmlOnly },
        }),
      );

      if (htmlOnly) {
        return { html: response.data };
      } else {
        return response.data;
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<EmailGenerateTemplateError>;
        if (!axiosError.response)
          throw new HttpException(
            'No response from email service',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        const errorMessage =
          axiosError.response?.data?.message || this.defaultErrorMessage;
        const errorStatus =
          axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(errorMessage, errorStatus);
      } else {
        throw new HttpException(
          'Failed to generate email template: Unknown error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
