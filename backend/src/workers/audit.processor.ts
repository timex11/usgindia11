import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AuditEventData } from '../audit/audit.service';

@Processor('audit-log')
export class AuditProcessor extends WorkerHost {
  private readonly logger = new Logger(AuditProcessor.name);

  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  async process(job: Job<AuditEventData, any, string>): Promise<any> {
    this.logger.log(`Processing audit log: ${job.id}`);
    const data = job.data;

    try {
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
        this.logger.error(`Failed to log audit event: ${error.message}`);
        throw error;
      } else {
        this.logger.log(`Audit event logged: ${data.eventType}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error processing audit log: ${errorMessage}`);
      throw error;
    }
  }
}
