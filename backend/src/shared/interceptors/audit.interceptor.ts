import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService, AuditEventType } from '@/audit/audit.service';
import { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { method, url, user, ip } = request;
    const userAgent = request.get('user-agent') || '';

    // Only log write operations
    const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(
      method,
    );

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          if (isWriteOperation && user) {
            void this.auditService.logEvent({
              userId: user.id || user.sub,
              eventType: AuditEventType.AI_INTERACTION, // Use a generic type or construction
              details: {
                action: `API_MUTATION_${method}`,
                url,
                body: request.body as Record<string, unknown>,
                response: data ? 'Success' : 'Empty Response',
              },
              severity: 'low',
              ipAddress: ip,
              userAgent: userAgent,
            });
          }
        },
        error: (error: unknown) => {
          if (isWriteOperation && user) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            void this.auditService.logEvent({
              userId: user.id || user.sub,
              eventType: AuditEventType.API_ERROR,
              details: {
                action: `API_MUTATION_FAILURE_${method}`,
                url,
                body: request.body as Record<string, unknown>,
                error: errorMessage,
              },
              severity: 'medium',
              ipAddress: ip,
              userAgent: userAgent,
            });
          }
        },
      }),
    );
  }
}
