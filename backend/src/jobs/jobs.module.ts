import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    SupabaseModule,
    NotificationsModule,
    PrismaModule,
    BullModule.registerQueue({ name: 'email' }, { name: 'notification-dispatch' }),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
