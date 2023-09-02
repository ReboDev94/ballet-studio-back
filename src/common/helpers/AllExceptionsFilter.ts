import { I18nService } from 'nestjs-i18n';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionI18n } from '../interfaces/HttpExceptionI18n';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const errorResponse = exception.getResponse() as HttpExceptionI18n;

    let message = '';
    if (!errorResponse.message && typeof errorResponse === 'object') {
      const { key, args } = errorResponse;
      message = await this.i18n.translate(key, {
        lang: ctx.getRequest().i18nLang,
        args,
      });
    } else {
      message = errorResponse.message;
    }

    response.status(statusCode).json({ statusCode, message });
  }
}
