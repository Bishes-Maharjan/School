/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLoggerService } from '../logger.service';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;

    let message = 'Internal server error';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message =
        typeof response === 'object' && response !== null
          ? (response as any).message || JSON.stringify(response)
          : String(response);
      stack = '';
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }
    const url = request.url;
    const ip = request.ip;
    const method = request.method;
    const userAgent = request.headers['user-agent'];

    this.logger.error({
      statusCode,
      method,
      url,
      message,
      ip,
      userAgent,
      stack,
    });

    response.status(statusCode).json({
      statusCode,
      method,
      message,
      url,
    });
  }
}
