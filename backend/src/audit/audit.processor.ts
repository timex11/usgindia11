import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AuditEventData } from './audit.service';

@Processor('audit-log')
@Injectable()
export class AuditProcessor extends WorkerHost {
  private readonly logger = new Logger(AuditProcessor.name);

  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  async process(job: Job<AuditEventData>): Promise<void> {
    const data = job.data;
    this.logger.log(`Processing audit event: ${data.eventType}`);

    const { error } = await this.supabaseService
      .getClient()
      .from('audit_logs')
      .insert([
        {
          user_id: data.userId,
          action: data.eventType,
          details: data.details || {},
          severity: data.severity || 'low',
          ip_address: data.ipAddress,
          user_agent: data.userAgent,
        },
      ]);

    if (error) {
      this.logger.error(`Failed to process audit event: ${error.message}`);
      throw error;
    }

    this.logger.log(`Audit event processed successfully: ${data.eventType}`);
  }
}
