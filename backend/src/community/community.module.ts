import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    SupabaseModule,
    BullModule.registerQueue({ name: 'notification-dispatch' }),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
