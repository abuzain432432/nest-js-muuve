import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class WsCatchAllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(WsCatchAllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const wsContext = host.switchToWs();
    const client = wsContext.getClient();
    const data = wsContext.getData();

    let message: string;

    this.logger.error('WebSocket Exception:', exception);
    console.log('++++++++++++++++++++++++++++');

    // Check if the exception is a MongoDB duplicate key error
    if (exception instanceof Error && (exception as any).code === 11000) {
      const [key, value] = Object.entries((exception as any).keyValue)[0];
      message = `Duplicate ${key} (${value})`;
    }
    // Handle NestJS WebSocket exceptions
    else if (exception instanceof WsException) {
      message = exception.message;
    }
    // Handle HTTP exceptions that may have been thrown
    else if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message =
        typeof response === 'string'
          ? response
          : (response as any).message || exception.message;
    } else {
      message = 'Internal server error';
    }

    // Define the response structure to send to the client
    const responseBody = {
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
      data,
    };

    // Emit the error message back to the client
    client.emit('exception', responseBody);
  }
}
