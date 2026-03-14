import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScholarshipsService } from '../scholarships/scholarships.service';
import { StatsService } from '../stats/stats.service';
import {
  Prisma,
  Profile,
  AuditLog,
  AdminLog,
  Scholarship,
} from '@prisma/client';
import { UserRole } from '@shared/types/enums';
import { AuditService, AuditEventType } from '../audit/audit.service';
import { AiService } from '../ai/ai.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scholarshipsService: ScholarshipsService,
    private readonly auditService: AuditService,
    private readonly statsService: StatsService,
    @Inject(forwardRef(() => AiService))
    private readonly aiService: AiService,
  ) {}

  async getSystemStats(): Promise<any> {
    return this.statsService.getSystemStats();
  }

  async getAllUsers(): Promise<Profile[]> {
    return this.prisma.profile.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInactiveUsers(days: number): Promise<Profile[]> {
    return this.statsService.getInactiveUsers(days);
  }

  async createScholarship(
    data: Prisma.ScholarshipCreateInput,
  ): Promise<Scholarship> {
    return this.scholarshipsService.create(data);
  }

  async getAiUsage(): Promise<any> {
    return await this.aiService.getAiUsage();
  }

  async getRecentActivity(limit = 20): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLogs(): Promise<AdminLog[]> {
    return this.prisma.adminLog.findMany({
      include: {
        admin: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProfile(
    userId: string,
    profileData: UpdateProfileDto,
    adminId: string,
  ) {
    const updatedProfile = await this.prisma.profile.update({
      where: { id: userId },
      data: profileData,
    });

    await this.auditService.logEvent({
      eventType: AuditEventType.ADMIN_USER_UPDATE,
      userId: adminId,
      details: { targetUserId: userId, changes: profileData },
      severity: 'medium',
    });

    return updatedProfile;
  }

  async banUser(userId: string, adminId: string) {
    const profile = await this.prisma.profile.update({
      where: { id: userId },
      data: { isBanned: true },
    });

    await this.auditService.logEvent({
      eventType: AuditEventType.ADMIN_USER_UPDATE,
      userId: adminId,
      details: { targetUserId: userId, action: 'ban' },
      severity: 'high',
    });

    return profile;
  }

  async unbanUser(userId: string, adminId: string) {
    const profile = await this.prisma.profile.update({
      where: { id: userId },
      data: { isBanned: false },
    });

    await this.auditService.logEvent({
      eventType: AuditEventType.ADMIN_USER_UPDATE,
      userId: adminId,
      details: { targetUserId: userId, action: 'unban' },
      severity: 'high',
    });

    return profile;
  }

  async updateUserRole(userId: string, role: UserRole, adminId: string) {
    const profile = await this.prisma.profile.update({
      where: { id: userId },
      data: { role },
    });

    await this.auditService.logEvent({
      eventType: AuditEventType.ADMIN_USER_UPDATE,
      userId: adminId,
      details: { targetUserId: userId, newRole: role },
      severity: 'high',
    });

    return profile;
  }

  async bulkAction(
    action: 'ban' | 'unban' | 'delete' | 'role_update',
    userIds: string[],
    data: { role?: UserRole },
    adminId: string,
  ) {
    const results = [];
    for (const userId of userIds) {
      try {
        if (action === 'ban') {
          await this.banUser(userId, adminId);
        } else if (action === 'unban') {
          await this.unbanUser(userId, adminId);
        } else if (action === 'role_update' && data?.role) {
          await this.updateUserRole(userId, data.role, adminId);
        }
        results.push({ userId, status: 'success' });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        results.push({ userId, status: 'failed', error: errorMessage });
      }
    }
    return results;
  }
}
