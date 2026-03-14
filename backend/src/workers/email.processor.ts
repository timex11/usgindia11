import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

interface EmailJobData {
  to: string;
}

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<EmailJobData, any, string>): Promise<any> {
    this.logger.log(`Processing email job ${job.id} for ${job.data.to}`);

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log(`Email sent successfully to ${job.data.to}`);

    // Optional: Log email to database if required or generate an audit log
    // Currently no specific EmailLog table, so we just log and return

    return { sent: true };
  }
}
