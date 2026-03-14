import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import {
  register,
  collectDefaultMetrics,
  Counter,
  Histogram,
  Gauge,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private httpRequestsTotal: Counter<string> | null = null;
  private httpRequestDuration: Histogram<string> | null = null;
  private apiErrorsTotal: Counter<string> | null = null;
  private activeUsers: Gauge<string> | null = null;
  private aiInteractionsTotal: Counter<string> | null = null;
  private searchQueriesTotal: Counter<string> | null = null;
  private notificationsSentTotal: Counter<string> | null = null;

  constructor() {
    try {
      collectDefaultMetrics();

      this.httpRequestsTotal = new Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status_code'],
      });

      this.httpRequestDuration = new Histogram({
        name: 'http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labelNames: ['method', 'route'],
        buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
      });

      this.apiErrorsTotal = new Counter({
        name: 'api_errors_total',
        help: 'Total number of API errors',
        labelNames: ['type', 'route'],
      });

      this.activeUsers = new Gauge({
        name: 'active_users',
        help: 'Number of active users',
        labelNames: ['period'],
      });

      this.aiInteractionsTotal = new Counter({
        name: 'ai_interactions_total',
        help: 'Total number of AI interactions',
        labelNames: ['provider', 'type'],
      });

      this.searchQueriesTotal = new Counter({
        name: 'search_queries_total',
        help: 'Total number of search queries',
        labelNames: ['type'],
      });

      this.notificationsSentTotal = new Counter({
        name: 'notifications_sent_total',
        help: 'Total notifications sent',
        labelNames: ['channel'],
      });

      this.logger.log('✅ Prometheus metrics initialized');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.warn(
        `⚠️ Metrics init failed: ${err.message}. Continuing without metrics.`,
      );
    }
  }

  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal?.inc({
      method,
      route,
      status_code: statusCode.toString(),
    });
  }

  recordHttpRequestDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration?.observe({ method, route }, duration);
  }

  incrementApiErrors(type: string, route: string) {
    this.apiErrorsTotal?.inc({ type, route });
  }

  setActiveUsers(count: number, period: string) {
    this.activeUsers?.set({ period }, count);
  }

  incrementAiInteractions(provider: string, type: string) {
    this.aiInteractionsTotal?.inc({ provider, type });
  }

  incrementSearchQueries(type: string) {
    this.searchQueriesTotal?.inc({ type });
  }

  incrementNotificationsSent(channel: string) {
    this.notificationsSentTotal?.inc({ channel });
  }

  async getMetrics(): Promise<string> {
    try {
      return await register.metrics();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Failed to retrieve metrics: ${err.message}`);
      throw new HttpException(
        'Metrics unavailable.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getContentType(): string {
    return register.contentType;
  }
}
