import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppGateway } from '../gateway/app.gateway';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AppGateway,
  ) {}

  async createNotification(
    userId: string,
    type: string,
    title: string,
    body: string,
    details?: any,
  ) {
    let notifType: NotificationType = NotificationType.INFO;
    if (
      Object.values(NotificationType).includes(
        type.toUpperCase() as NotificationType,
      )
    ) {
      notifType = type.toUpperCase() as NotificationType;
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type: notifType,
        title,
        message: body,
      },
    });

    // Real-time broadcast
    try {
      this.gateway.sendToUser(userId, 'notification', {
        ...notification,
        details: details as Record<string, any>,
      });
    } catch (err) {
      this.logger.error(
        `Failed to broadcast notification: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }

    return notification;
  }

  async getMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
