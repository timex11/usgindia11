import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { SupabaseModule } from '../supabase/supabase.module';
import { CommunityModule } from '../community/community.module';

@Module({
  imports: [SupabaseModule, CommunityModule],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class GatewayModule {}
