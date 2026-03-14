import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();
    const requestId = randomUUID();

    // Attach Request ID to request object for use in other parts of the app
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (request as any).requestId = requestId;

    // Add Request ID to response headers
    response.setHeader('X-Request-ID', requestId);

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const duration = Date.now() - startTime;

      // Add Response Time header (removed to avoid ERR_HTTP_HEADERS_SENT)
      // response.setHeader('X-Response-Time', `${duration}ms`);

      this.logger.log(
        `[${requestId}] ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} +${duration}ms`,
      );
    });

    next();
  }
}
