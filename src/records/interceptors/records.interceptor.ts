import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RecordsMessages } from '../messages/records.messages';

export class RecordsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file && !request.body.message) {
      throw new BadRequestException(RecordsMessages.PROVIDE_FILE_OR_MESSAGE);
    }

    return next.handle();
  }
}
