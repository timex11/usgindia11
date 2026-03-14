import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditModule } from '../audit/audit.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,
    AuditModule,
    BullModule.registerQueue({ name: 'certificate' }, { name: 'notification-dispatch' }),
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
