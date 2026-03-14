import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    // Custom Header Check (Example only)
    // const _apiKey = request.headers['x-usgindia-api-key'];

    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-XSS-Protection', '1; mode=block');
    response.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );

    // This is a placeholder for actual organizational logic
    // if (process.env.NODE_ENV === 'production' && !apiKey) {
    //   throw new ForbiddenException('Missing Custom Security Header');
    // }

    next();
  }
}
