import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export enum AuditEventType {
  // Auth Events
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_REGISTER = 'user_register',
  AUTH_FAILURE = 'auth_failure',

  // Profile & User Management
  USER_PROFILE_UPDATE = 'user_profile_update',
  ADMIN_USER_UPDATE = 'admin_user_update',
  ADMIN_ROLE_CHANGE = 'admin_role_change',

  // Exam Events
  EXAM_STARTED = 'exam_started',
  EXAM_SUBMITTED = 'exam_submitted',
  PROCTORING_VIOLATION = 'proctoring_violation',

  // Content & AI
  CMS_CONTENT_UPDATE = 'cms_content_update',
  AI_INTERACTION = 'ai_interaction',

  // System
  API_ERROR = 'api_error',
  DATABASE_MIGRATION = 'database_migration',
  SECURITY_POLICY_UPDATE = 'security_policy_update',
}

export interface AuditEventData {
  eventType: AuditEventType;
  userId: string;
  details?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high';
  ipAddress?: string;
  userAgent?: string;
  fingerprintHash?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('audit-log') private auditQueue: Queue,
  ) {}

  async logEvent(data: AuditEventData) {
    try {
      await this.auditQueue.add('log-event', data);
      this.logger.log(`Audit event queued: ${data.eventType}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `Failed to queue audit event: ${errorMessage}. Fallback to direct insert.`,
      );
      // Fallback to direct insert
      await this.insertAuditLog(data);
    }
  }

  // Extract direct insert logic
  private async insertAuditLog(data: AuditEventData) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.eventType,
          details: data.details || {},
          severity: (data.severity?.toUpperCase() || 'LOW') as any,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
      this.logger.log(`Audit event logged (direct): ${data.eventType}`);
    } catch (error) {
      this.logger.error(
        `Failed to log audit event (fallback): ${error.message}`,
      );
    }
  }

  async getAuditLogs(userId?: string): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });
  }
}
