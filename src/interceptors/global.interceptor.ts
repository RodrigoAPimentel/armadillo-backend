import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import Logger from '../logger/Logger';
import { getCircularReplacer } from 'src/commons/jsonCircularReplacer';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    const method: string = req.method;
    const url: string = req.url;
    const path: string = req.path;
    const originalUrl: string = req.originalUrl;
    const body = req.body;
    const headers = req.headers;

    console.log(
      `\n============ ${new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      })} ===========================================================================`,
    );

    this.log(
      method,
      '',
      url,
      path,
      originalUrl,
      body,
      Date.now(),
      'call',
      headers,
    );

    const start = Date.now();

    return next.handle().pipe(
      tap((result) => {
        const statusCode = ctx.getResponse().statusCode;
        const httpCache: boolean = req.httpCache;
        this.log(
          method,
          statusCode,
          url,
          path,
          originalUrl,
          body,
          start,
          'response',
          headers,
          httpCache,
          result,
        );
      }),
      catchError((err: any) => {
        const statusCode = err.status || 500;
        const httpCache: boolean = req.httpCache;
        this.log(
          method,
          statusCode,
          url,
          path,
          originalUrl,
          body,
          start,
          'response',
          headers,
          httpCache,
          err.stack,
          true,
        );
        return throwError(err);
      }),
    );
  }

  log(
    method: string,
    statusCode: string,
    url: string,
    path: string,
    originalUrl: string,
    body: any,
    start: number,
    type: string,
    headers: any,
    httpCache?: boolean,
    response?: any,
    error?: boolean,
  ) {
    const end = Date.now();
    const ellapsedTimeInMilli = `+${end - start}ms`;

    const obj = {
      method,
      type,
      statusCode,
      url,
      path,
      originalUrl,
      headers,
      response,
      body,
      ellapsedTimeInMilli,
      httpCache: Boolean(httpCache),
    };

    this.logger.http(JSON.stringify(obj, getCircularReplacer(), 2));
  }
}
