import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobType, ApplicationStatus } from '@shared/types/enums';
import { CreateJobDto, UpdateJobDto } from './dto/create-job.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { Prisma } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('notification-dispatch') private readonly notificationQueue: Queue,
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
      include: { job: true, applicant: true },
    });

    // Direct notification
    await this.notificationsService.createNotification(
      application.applicantId,
      'INFO',
      'Job Application Status Updated',
      `Your application for ${application.job.title} at ${application.job.company} is now ${status}.`,
    );

    // BullMQ background notification
    await this.notificationQueue.add('dispatch', {
      userId: application.applicantId,
      title: 'Job Update',
      body: `Big news! Your application for ${application.job.title} is now ${status}.`,
      type: 'SUCCESS',
    });

    return application;
  }

  async apply(userId: string, jobId: string /* resumeUrl?: string */) {
    const existing = await this.prisma.jobApplication.findFirst({
      where: {
        jobId,
        applicantId: userId,
      },
    });

    if (existing) {
      throw new Error('Already applied to this job');
    }

    const application = await this.prisma.jobApplication.create({
      data: {
        applicantId: userId,
        jobId: jobId,
        status: ApplicationStatus.SUBMITTED,
      },
      include: { job: true, applicant: true },
    });

    // Queue background email
    await this.emailQueue.add('send', {
      to: application.applicant.email,
      subject: 'Application Received',
      body: `Your application for ${application.job.title} has been received.`,
    });

    return application;
  }

  async create(data: CreateJobDto) {
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
