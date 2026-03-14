import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TeamController } from './team.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { ScholarshipsModule } from '../scholarships/scholarships.module';
import { AiModule } from '../ai/ai.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [SupabaseModule, ScholarshipsModule, StatsModule, AiModule],
  controllers: [AdminController, TeamController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
