import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from "@nestjs/common";

import { Request } from "express";
import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";
/**
 * IF you want to customize the timeoutTime period pass an instance
 *
 * Instead of class
 *
 *  **/
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private timeoutTimeInSeconds: number = 5) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const methodType = request.method;
    const endpoint = request.url;

    return next.handle().pipe(
      timeout(this.timeoutTimeInSeconds * 1000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          console.log(
            `Timeout error at endpoint:${endpoint} , methodName:${methodName} requestType:${methodType}, className:${className}`,
          );
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
