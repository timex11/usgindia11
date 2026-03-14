import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    path: string;
    requestId?: string;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const http = context.switchToHttp();
    const request = http.getRequest<AuthenticatedRequest>();
    const requestId = request.requestId;

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
          path: request.url,
          requestId,
        },
      })),
    );
  }
}
