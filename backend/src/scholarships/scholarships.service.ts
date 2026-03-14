import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { ApplicationStatus } from '@shared/types/enums';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ScholarshipsService {
  private readonly logger = new Logger(ScholarshipsService.name);

  constructor(
    private prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('notification-dispatch') private readonly notificationQueue: Queue,
  ) {}

  async create(data: Prisma.ScholarshipCreateInput) {
    return this.prisma.scholarship.create({ data });
  }

  async findAll(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { search, limit = 10, offset = 0 } = filters || {};

    const where: Prisma.ScholarshipWhereInput = {};

    // Assuming 'category' might be part of 'eligibilityCriteria' JSON in new schema
    // or just removed if not present. Let's check schema.
    // Schema: Scholarship { ... eligibilityCriteria Json? ... }
    // Old schema had 'category'. New schema doesn't.
    // We can filter by 'provider' or search in description.

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.scholarship.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.scholarship.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string) {
    return this.prisma.scholarship.findUnique({ where: { id } });
  }

  async findAllApplications() {
    return this.prisma.scholarshipApplication.findMany({
      include: {
        scholarship: true,
        // Using manual select for applicant relation
        // applicant: Profile
        applicant: {
          // Relation name 'applicant' must exist in schema
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findApplicationsByUser(userId: string) {
    return this.prisma.scholarshipApplication.findMany({
      where: { applicantId: userId },
      include: { scholarship: true },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    const application = await this.prisma.scholarshipApplication.update({
      where: { id },
      data: { status },
      include: { scholarship: true, applicant: true },
    });

    // Notify user via direct service
    await this.notificationsService.createNotification(
      application.applicantId,
      'INFO',
      'Scholarship Status Updated',
      `Your application for ${application.scholarship.title} is now ${status}.`,
    );

    // Notify user via background dispatch
    await this.notificationQueue.add('dispatch', {
      userId: application.applicantId,
      title: 'Scholarship Update',
      body: `Your application for ${application.scholarship.title} has reached a new stage: ${status}.`,
      type: 'SUCCESS',
    });

    return application;
  }

  async findMatches(userId: string) {
    const user = await this.prisma.profile.findUnique({
      where: { id: userId },
      include: {
        course: true,
        // department: true, // Check if department relation exists on Profile directly or via Course
        // Profile has course relation. Course has department.
        // Let's assume Profile has 'course' relation.
      },
    });
    if (!user) return [];

    const allScholarships = await this.prisma.scholarship.findMany();

    // Advanced Scoring Algorithm
    return allScholarships
      .map((scholarship) => {
        let score = 0;
        // Check eligibilityCriteria JSON if populated
        // Fallback to description string match
        const description = scholarship.description?.toLowerCase() || '';

        // 1. Role/Keyword Match
        if (description.includes(user.role.toLowerCase())) score += 10;

        // 2. State Match
        if (user.state && description.includes(user.state.toLowerCase())) {
          score += 30;
        }

        // 3. Gender Specificity
        if (user.gender) {
          const gender = user.gender.toLowerCase();
          const isFemaleOnly =
            description.includes('girl') ||
            description.includes('female') ||
            description.includes('woman');

          if (isFemaleOnly) {
            if (gender === 'female' || gender === 'woman') score += 20;
            else score = -100; // Disqualify
          }
        }

        return { ...scholarship, matchScore: score };
      })
      .filter((s) => s.matchScore > 0)
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  async apply(userId: string, scholarshipId: string) {
    // Check if already applied
    const existing = await this.prisma.scholarshipApplication.findFirst({
      where: {
        scholarshipId,
        applicantId: userId,
      },
    });

    if (existing) {
      throw new Error('Already applied to this scholarship');
    }

    const application = await this.prisma.scholarshipApplication.create({
      data: {
        applicantId: userId,
        scholarshipId: scholarshipId,
        status: ApplicationStatus.SUBMITTED,
      },
      include: { scholarship: true, applicant: true },
    });

    // Notify user of successful submission via BullMQ
    await this.notificationQueue.add('dispatch', {
      userId: userId,
      title: 'Scholarship Applied',
      body: `You have successfully applied for the ${application.scholarship.title}.`,
      type: 'INFO',
    });

    // Send confirmation email via BullMQ
    await this.emailQueue.add('send', {
      to: application.applicant.email,
      subject: 'Scholarship Application Received',
      body: `We have received your application for ${application.scholarship.title}.`,
    });

    return application;
  }

  async update(id: string, data: Prisma.ScholarshipUpdateInput) {
    return this.prisma.scholarship.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.scholarship.delete({ where: { id } });
  }
}
