import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { LLMProviderService } from './llm-provider.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { StatsModule } from '../stats/stats.module';
import { ScholarshipsModule } from '../scholarships/scholarships.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [SupabaseModule, StatsModule, ScholarshipsModule, AuditModule],
  controllers: [AiController],
  providers: [AiService, LLMProviderService],
  exports: [AiService],
})
export class AiModule {}
