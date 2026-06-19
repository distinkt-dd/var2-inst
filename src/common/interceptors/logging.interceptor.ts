import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      tap(() => this.logger.log(`${method} ${url} - Success`)),

      catchError((err) => {
        const status = err.status || 500;
        const message = err.message || err;

        this.logger.error(`${method} ${url} - Error [${status}]: ${message}`);

        return throwError(() => err);
      }),
    );
  }
}
