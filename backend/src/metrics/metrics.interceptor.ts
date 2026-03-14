import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = (Date.now() - start) / 1000;
          const route = this.normalizeRoute(url);

          this.metricsService.incrementHttpRequests(
            method,
            route,
            response.statusCode,
          );
          this.metricsService.recordHttpRequestDuration(
            method,
            route,
            duration,
          );
        },
        error: (error) => {
          const duration = (Date.now() - start) / 1000;
          const route = this.normalizeRoute(url);
          const statusCode = error?.status || 500;

          this.metricsService.incrementHttpRequests(method, route, statusCode);
          this.metricsService.recordHttpRequestDuration(
            method,
            route,
            duration,
          );
          this.metricsService.incrementApiErrors(
            error?.name || 'UnknownError',
            route,
          );
        },
      }),
    );
  }

  private normalizeRoute(url: string): string {
    // Replace UUIDs and numeric IDs with :id for aggregation
    return url
      .replace(
        /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        '/:id',
      )
      .replace(/\/\d+/g, '/:id')
      .split('?')[0];
  }
}
