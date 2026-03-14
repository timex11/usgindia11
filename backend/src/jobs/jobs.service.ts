import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobType, ApplicationStatus } from '@shared/types/enums';
import { CreateJobDto, UpdateJobDto } from './dto/create-job.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(filters: {
    type?: string;
    location?: string;
    search?: string;
  }) {
    const where: Prisma.JobWhereInput = {};
    if (filters.location) where.location = { contains: filters.location };
    if (filters.type) where.type = filters.type as JobType;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { company: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          select: { id: true, status: true, appliedAt: true },
        },
      },
    });
  }

  async findApplicationsByUser(userId: string) {
    return this.prisma.jobApplication.findMany({
      where: { applicantId: userId },
      include: { job: true },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async findAllApplications() {
    return this.prisma.jobApplication.findMany({
      include: {
        job: true,
        // Using 'any' cast temporarily if applicant relation name mismatch occurs,
        // but schema has 'applicant' which maps to 'Profile'
        // In schema: applicant Profile @relation(...)
        applicant: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    const application = await this.prisma.jobApplication.update({
      where: { id },
      data: { status },
      include: { job: true },
    });

    // Notify user
    await this.notificationsService.createNotification(
      application.applicantId,
      'INFO',
      'Job Application Status Updated',
      `Your application for ${application.job.title} at ${application.job.company} is now ${status}.`,
    );

    return application;
  }

  async apply(userId: string, jobId: string /* resumeUrl?: string */) {
    // Check for existing application
    const existing = await this.prisma.jobApplication.findFirst({
      where: {
        jobId,
        applicantId: userId,
      },
    });

    if (existing) {
      throw new Error('Already applied to this job');
    }

    return this.prisma.jobApplication.create({
      data: {
        applicantId: userId,
        jobId,
        status: ApplicationStatus.SUBMITTED,
      },
    });
  }

  async create(data: CreateJobDto) {
    // Cast DTO to Prisma Input if needed, but fields align
    return this.prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type as JobType,
        description: data.description,
        salaryRange: data.salaryRange,
      },
    });
  }

  async update(id: string, data: UpdateJobDto) {
    return this.prisma.job.update({
      where: { id },
      data: {
        ...data,
        type: data.type as JobType,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.job.delete({
      where: { id },
    });
  }
}
