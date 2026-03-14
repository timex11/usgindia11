import { Module } from '@nestjs/common';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { SeoService } from './seo.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [CmsController],
  providers: [CmsService, SeoService],
  exports: [CmsService, SeoService],
})
export class CmsModule {}
