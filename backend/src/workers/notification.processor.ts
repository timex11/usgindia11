import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AppGateway } from '../gateway/app.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

interface NotificationJobData {
  userId: string;
  title: string;
  body: string;
  type: string;
}

@Processor('notification-dispatch')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly gateway: AppGateway,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<NotificationJobData, any, string>): Promise<any> {
    this.logger.log(`Dispatching notification: ${job.id}`);
    const { userId, title, body, type } = job.data;

    try {
      // 1. Resolve user devices (Mock implementation)
      this.logger.log(`Resolving devices for user ${userId}...`);

      // 2. Send push notification (FCM/OneSignal mock)
      this.logger.log(`Sending push notification to user ${userId}: ${title}`);

      // 3. Store in-app notification in DB
      try {
        let notifType: NotificationType = NotificationType.INFO;
        if (
          type &&
          Object.values(NotificationType).includes(
            type.toUpperCase() as NotificationType,
          )
        ) {
          notifType = type.toUpperCase() as NotificationType;
        }
        await this.prisma.notification.create({
          data: {
            userId,
            title,
            message: body,
            type: notifType,
            isRead: false,
          },
        });
        this.logger.log(`Stored in-app notification for user ${userId}`);
      } catch (dbError) {
        const errorMsg =
          dbError instanceof Error ? dbError.message : String(dbError);
        this.logger.warn(`Could not store notification in DB: ${errorMsg}`);
      }

      // 4. Emit via WebSocket Gateway
      this.gateway.sendToUser(userId, 'notification', {
        title,
        body,
        type,
        timestamp: new Date().toISOString(),
      });
      this.logger.log(`Emitted WebSocket event for user ${userId}`);

      return { success: true, userId };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error dispatching notification: ${errorMsg}`);
      throw error;
    }
  }
}
