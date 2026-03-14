import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { AppGateway } from '../gateway/app.gateway';

interface CertificateJobData {
  userName: string;
  examTitle: string;
  userId: string;
  examId: string;
}

@Processor('certificate')
export class CertificateProcessor extends WorkerHost {
  private readonly logger = new Logger(CertificateProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AppGateway,
  ) {
    super();
  }

  async process(job: Job<CertificateJobData, any, string>): Promise<any> {
    this.logger.log(
      `Generating certificate for ${job.data.userName} - Exam: ${job.data.examTitle}`,
    );

    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const certUrl = `https://storage.usgindia.org/certificates/cert_${job.data.userId}_${job.data.examId}.pdf`;

    this.logger.log(`Certificate generated: ${certUrl}`);

    // Notify user via DB and Real-time Gateway
    if (job.data.userId) {
      const notification = await this.prisma.notification.create({
        data: {
          userId: job.data.userId,
          type: 'INFO',
          title: 'Certificate Ready',
          message: `Your certificate for ${job.data.examTitle} is now available.`,
        },
      });

      this.gateway.sendToUser(job.data.userId, 'notification', {
        ...notification,
        details: { url: certUrl },
      });
    }

    return { url: certUrl };
  }
}
