import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
// NOTE Don't manually instantiate filters with new when using them at the method or controller level in NestJS.
export class CatchAllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  // NOTE there is an error property in the exception object that is not being used
  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    let message: string;
    console.log('***********************************');
    console.log(exception);
    console.log('***********************************');

    if (exception?.code === 11000) {
      const [key, value] = Object.entries(exception.errorResponse.keyValue)[0];
      message = `Duplicate ${key} (${value})`;
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message =
        typeof response === 'string'
          ? response
          : (response as any).message || exception.message;
    } else {
      message = 'Internal server error';
    }
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path,
      message,
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
