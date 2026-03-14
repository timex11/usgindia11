import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
      log: isDevelopment
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'info' },
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ]
        : ['error', 'warn'],
    });
  }

  onModuleInit() {
    // Lazy connect: Do NOT connect here. Let the first query trigger connection.
    // This dramatically improves startup time.

    // Setup logging hooks if needed (must be done before connection)
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Prisma types for $on can be tricky with extended classes
      this.$on('query', (e: any) => {
        const event = e as { query: string; duration: number };
        this.logger.debug(`Query: ${event.query}`);
        this.logger.debug(`Duration: ${event.duration}ms`);
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from the database');
  }
}
