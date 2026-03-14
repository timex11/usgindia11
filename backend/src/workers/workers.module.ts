import { Module, DynamicModule } from '@nestjs/common';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { CertificateProcessor } from './certificate.processor';
import { AuditProcessor } from './audit.processor';
import { FileProcessor } from './file.processor';
import { NotificationProcessor } from './notification.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { GatewayModule } from '../gateway/gateway.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({})
export class WorkersModule {
  static register(): DynamicModule {
    const isRedisSupported = process.env.REDIS_SUPPORTED === 'true';

    if (!isRedisSupported) {
      const mockQueue = {
        add: () => Promise.resolve({ id: 'mock' }),
        getJobCounts: () =>
          Promise.resolve({ waiting: 0, active: 0, failed: 0 }),
      };

      return {
        module: WorkersModule,
        global: true,
        providers: [
          {
            provide: getQueueToken('email'),
            useValue: mockQueue,
          },
          {
            provide: getQueueToken('certificate'),
            useValue: mockQueue,
          },
          {
            provide: getQueueToken('audit-log'),
            useValue: mockQueue,
          },
          {
            provide: getQueueToken('file-processing'),
            useValue: mockQueue,
          },
          {
            provide: getQueueToken('notification-dispatch'),
            useValue: mockQueue,
          },
        ],
        exports: [
          getQueueToken('email'),
          getQueueToken('certificate'),
          getQueueToken('audit-log'),
          getQueueToken('file-processing'),
          getQueueToken('notification-dispatch'),
        ],
      };
    }

    return {
      module: WorkersModule,
      global: true,
      imports: [
        PrismaModule,
        GatewayModule,
        SupabaseModule,
        BullModule.registerQueue(
          { name: 'email' },
          { name: 'certificate' },
          { name: 'audit-log' },
          { name: 'file-processing' },
          { name: 'notification-dispatch' },
        ),
      ],
      providers: [
        EmailProcessor,
        CertificateProcessor,
        AuditProcessor,
        FileProcessor,
        NotificationProcessor,
      ],
      exports: [
        BullModule,
        EmailProcessor,
        CertificateProcessor,
        AuditProcessor,
        FileProcessor,
        NotificationProcessor,
      ],
    };
  }
}
