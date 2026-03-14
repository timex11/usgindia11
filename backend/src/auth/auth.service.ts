import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AuditService, AuditEventType } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from '../admin/dto/update-profile.dto';
import { UserRole } from '@prisma/client';

// Hardcoded UUIDs for Offline Dev Mode (Must match seed.ts)
const ADMIN_ID = '11111111-1111-1111-1111-111111111111';
const STUDENT_ID = '22222222-2222-2222-2222-222222222222';
// const ALUMNI_ID = ...
const TEACHER_ID = '44444444-4444-4444-4444-444444444444';
// const COLLEGE_ADMIN_ID = ...

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly auditService: AuditService,
    private readonly prisma: PrismaService,
    private readonly cloudflareService: CloudflareService,
  ) {}

  async register(data: RegisterDto) {
    if (data.turnstileToken) {
      const isHuman = await this.cloudflareService.verifyTurnstile(
        data.turnstileToken,
      );
      if (!isHuman) {
        throw new BadRequestException('Security verification failed.');
      }
    }

    const { data: authData, error: authError } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email: data.email,
        password: data.password,
      });

    if (authError || !authData.user) {
      throw new BadRequestException(
        authError?.message || 'Registration failed',
      );
    }

    // Default to STUDENT if invalid role passed
    let role: UserRole = UserRole.STUDENT;
    if (Object.values(UserRole).includes(data.role as UserRole)) {
      role = data.role as UserRole;
    }

    const profile = await this.prisma.profile.create({
      data: {
        id: authData.user.id,
        email: data.email,
        fullName: data.fullName,
        role: role,
      },
    });

    await this.auditService.logEvent({
      eventType: AuditEventType.USER_REGISTER,
      userId: profile.id,
      details: { email: data.email, role: role },
      severity: 'low',
    });

    return { user: authData.user, profile };
  }

  async login(email: string, pass: string, turnstileToken?: string) {
    if (turnstileToken) {
      const isHuman =
        await this.cloudflareService.verifyTurnstile(turnstileToken);
      if (!isHuman)
        throw new BadRequestException('Security verification failed.');
    }

    // --- OFFLINE DEV MODE ---
    if (process.env.NODE_ENV === 'development') {
      let devUser = null;
      if (email === 'admin@usgindia.com')
        devUser = {
          id: ADMIN_ID,
          role: UserRole.PLATFORM_ADMIN,
          fullName: 'System Admin',
        };
      else if (email === 'student@example.com')
        devUser = {
          id: STUDENT_ID,
          role: UserRole.STUDENT,
          fullName: 'Rahul Student',
        };
      else if (email === 'teacher@example.com')
        devUser = {
          id: TEACHER_ID,
          role: UserRole.FACULTY,
          fullName: 'Prof. Teacher',
        };

      if (devUser) {
        return {
          user: {
            id: devUser.id,
            email,
            role: devUser.role,
            fullName: devUser.fullName,
          },
          access_token: `DEV_TOKEN_${devUser.role}`,
        };
      }
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password: pass,
      });

    if (error || !data.user || !data.session) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: data.user.id },
    });

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || UserRole.STUDENT,
        fullName: profile?.fullName,
      },
      access_token: data.session.access_token,
    };
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
      },
    });
  }

  async validateUser(token: string) {
    if (token.startsWith('DEV_TOKEN_')) {
      // Return mock user based on token
      return {
        id: STUDENT_ID,
        email: 'student@example.com',
        role: UserRole.STUDENT,
      };
    }

    const {
      data: { user },
      error,
    } = await this.supabaseService.getClient().auth.getUser(token);
    if (error || !user) throw new UnauthorizedException('Invalid token');
    return user;
  }

  async getUserPermissions(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!profile) return { roles: [], permissions: [] };

    const roles = profile.roles.map((r) => r.role.slug);
    const permissions = new Set<string>();
    profile.roles.forEach((assignment) => {
      assignment.role.permissions.forEach((rp) => {
        permissions.add(rp.permission.slug);
      });
    });

    return { roles, permissions: Array.from(permissions) };
  }

  async getDashboardData(userId: string) {
    const [examAttempts, scholarshipApps, jobApps, notifications] =
      await Promise.all([
        this.prisma.examAttempt.findMany({
          where: { userId },
          include: { exam: true },
          orderBy: { startedAt: 'desc' },
          take: 5,
        }),
        this.prisma.scholarshipApplication.count({
          where: { applicantId: userId },
        }), // Fixed field name
        this.prisma.jobApplication.findMany({
          where: { applicantId: userId }, // Fixed field name
          include: { job: true },
          orderBy: { appliedAt: 'desc' },
          take: 5,
        }),
        this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

    return {
      stats: {
        totalApplications: scholarshipApps + jobApps.length,
        activeExams: examAttempts.filter((a) => a.status === 'IN_PROGRESS')
          .length, // Enum check
        completedExams: examAttempts.filter((a) => a.status === 'COMPLETED')
          .length,
      },
      activity: [], // TODO: map properly if needed
      notifications,
    };
  }
}
