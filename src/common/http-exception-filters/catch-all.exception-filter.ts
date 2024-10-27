import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

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
    let httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;
    console.log("_____________________________");
    console.log(exception);
    const isMongooseValidationError = exception.errors;
    if (isMongooseValidationError) {
      message = Object.values(exception.errors)
        .map((error: any) => error.message)
        .join(", ");
      httpStatus = HttpStatus.BAD_REQUEST;
    } else if (exception?.code === 11000) {
      const [key, value] = Object.entries(exception.errorResponse.keyValue)[0];
      message = `Duplicate ${key} (${value})`;
      httpStatus = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message =
        typeof response === "string"
          ? response
          : (response as any).message || exception.message;
      httpStatus = exception.getStatus();
    } else {
      message = "Internal server error";
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path,
      message,
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
