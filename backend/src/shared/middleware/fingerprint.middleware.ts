import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as requestIp from 'request-ip';
import { UAParser } from 'ua-parser-js';

export interface FingerprintRequest extends Request {
  fingerprint: {
    ip: string;
    userAgent: string;
    device: {
      browser?: string;
      os?: string;
      device?: string;
      type?: string;
    };
    hash: string;
  };
}

@Injectable()
export class FingerprintMiddleware implements NestMiddleware {
  use(req: FingerprintRequest, res: Response, next: NextFunction) {
    const ip = requestIp.getClientIp(req) || 'unknown';
    const ua = req.headers['user-agent'] || '';
    const parser = new UAParser(ua);
    const result = parser.getResult();

    req.fingerprint = {
      ip,
      userAgent: ua,
      device: {
        browser: result.browser.name,
        os: result.os.name,
        device: result.device.model,
        type: result.device.type,
      },
      hash: this.generateHash(ip, ua),
    };

    next();
  }

  private generateHash(ip: string, ua: string): string {
    // Simple non-crypto hash for dev/id purposes.
    // In production, use a proper crypto hash if needed.
    let hash = 0;
    const str = `${ip}-${ua}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}
