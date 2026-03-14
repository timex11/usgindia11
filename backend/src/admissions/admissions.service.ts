import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AdmissionsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('notification-dispatch') private readonly notificationQueue: Queue,
  ) {}

  async create(userId: string, createAdmissionDto: CreateAdmissionDto) {
    const application = await this.prisma.admissionApplication.create({
      data: {
        applicantId: userId,
        universityId: createAdmissionDto.universityId,
        courseId: createAdmissionDto.courseId,
        documents: createAdmissionDto.documents || {},
      },
      include: {
        applicant: true,
      },
    });

    // Notify user via BullMQ
    await this.notificationQueue.add('dispatch', {
      userId: userId,
      title: 'Application Submitted',
      body: `Your admission application has been received successfully.`,
      type: 'INFO',
    });

    // Send confirmation email via BullMQ
    await this.emailQueue.add('send', {
      to: application.applicant.email,
      subject: 'Admission Application Received',
      template: 'admission-received',
    });

    return application;
  }

  async findAll() {
    return this.prisma.admissionApplication.findMany({
      include: {
        applicant: true,
      },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.admissionApplication.findUnique({
      where: { id },
      include: {
        applicant: true,
      },
    });
    if (!application) {
      throw new NotFoundException(`Admission application with ID ${id} not found`);
    }
    return application;
  }

  async findByUser(userId: string) {
    return this.prisma.admissionApplication.findMany({
      where: { applicantId: userId },
    });
  }

  async update(id: string, updateAdmissionDto: UpdateAdmissionDto) {
    const application = await this.prisma.admissionApplication.update({
      where: { id },
      data: updateAdmissionDto as any,
      include: {
        applicant: true,
      },
    });

    // Notify user of status update
    if (updateAdmissionDto.status) {
      await this.notificationQueue.add('dispatch', {
        userId: application.applicantId,
        title: 'Application Status Updated',
        body: `Your application status is now ${updateAdmissionDto.status}.`,
        type: 'INFO',
      });
    }

    return application;
  }

  async remove(id: string) {
    return this.prisma.admissionApplication.delete({
      where: { id },
    });
  }
}
