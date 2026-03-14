import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthModule } from './health/health.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { ExamsModule } from './exams/exams.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { JobsModule } from './jobs/jobs.module';
import { AlumniModule } from './alumni/alumni.module';
import { CommunityModule } from './community/community.module';
import { AdminModule } from './admin/admin.module';
import { GatewayModule } from './gateway/gateway.module';
import { BullModule } from '@nestjs/bullmq';
import { AiModule } from './ai/ai.module';
import { CmsModule } from './cms/cms.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { ResourcesModule } from './resources/resources.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScholarshipsModule } from './scholarships/scholarships.module';
import { WorkersModule } from './workers/workers.module';
import { FilesModule } from './files/files.module';
import { ContactModule } from './contact/contact.module';
import { TodosModule } from './todos/todos.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { SystemModule } from './system/system.module';
import { SocialModule } from './social/social.module';
import { ChatModule } from './chat/chat.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { QueueBoardModule } from './admin/queue-board.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggingMiddleware } from '@shared/middleware/logging.middleware';
import { SecurityMiddleware } from '@shared/middleware/security.middleware';
import { SharedModule } from '@shared/shared.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EmailModule } from './email/email.module';
import { SearchModule } from './search/search.module';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { SmsModule } from './sms/sms.module';
import { FingerprintMiddleware } from '@shared/middleware/fingerprint.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    SharedModule,
    ...(process.env.REDIS_SUPPORTED === 'true'
      ? [
          CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
              const store = await import('cache-manager-redis-yet').then(
                (m) => m.redisStore,
              );
              return {
                store: await store({
                  socket: {
                    host: configService.get('REDIS_HOST') || 'localhost',
                    port: Number.parseInt(
                      configService.get('REDIS_PORT') || '6379',
                      10,
                    ),
                  },
                  ttl: 60 * 1000,
                }),
              };
            },
            inject: [ConfigService],
          }),
          BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              connection: {
                host: configService.get('REDIS_HOST') || 'localhost',
                port: Number.parseInt(
                  configService.get('REDIS_PORT') || '6379',
                  10,
                ),
                password: configService.get('REDIS_PASSWORD'),
              },
            }),
            inject: [ConfigService],
          }),
        ]
      : [
          CacheModule.register({
            isGlobal: true,
            ttl: 60 * 1000,
          }),
        ]),
    PrismaModule,
    HealthModule,
    SupabaseModule,
    AuthModule,
    ExamsModule,
    InstitutionsModule,
    JobsModule,
    AlumniModule,
    CommunityModule,
    AdminModule,
    GatewayModule,
    AiModule,
    CmsModule,
    NotificationsModule,
    AuditModule,
    ResourcesModule,
    ScholarshipsModule,
    WorkersModule.register(),
    FilesModule,
    ContactModule,
    TodosModule,
    WebhooksModule,
    SystemModule,
    SocialModule,
    ChatModule,
    WorkspaceModule,
    QueueBoardModule.register(),
    KnowledgeModule,
    CloudflareModule,
    EmailModule,
    SearchModule,
    MetricsModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware, SecurityMiddleware, FingerprintMiddleware)
      .forRoutes('*');
  }
}
