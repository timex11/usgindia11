import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private clientInstance: SupabaseClient<any, 'public', any>;
  private adminClientInstance: SupabaseClient<any, 'public', any> | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initClients();
  }

  private initClients() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    const serviceKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (
      !supabaseUrl ||
      !supabaseKey ||
      supabaseKey === 'your_supabase_anon_key'
    ) {
      this.logger.warn(
        'Supabase configuration is missing or using placeholders. Using mock client.',
      );
      // Create a minimal mock client to prevent crashes
      const mockClient = {
        auth: {
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          getSession: () =>
            Promise.resolve({ data: { session: null }, error: null }),
        },
        from: () => ({
          select: () => ({ data: [], error: null }),
          insert: () => ({ data: null, error: null }),
          update: () => ({ data: null, error: null }),
          delete: () => ({ data: null, error: null }),
        }),
        storage: {
          from: () => ({
            upload: () =>
              Promise.resolve({ data: { path: 'mock' }, error: null }),
            getPublicUrl: () => ({ data: { publicUrl: 'https://mock.url' } }),
            remove: () => Promise.resolve({ error: null }),
          }),
        },
      };
      this.clientInstance = mockClient as unknown as SupabaseClient<
        any,
        'public',
        any
      >;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.clientInstance = createClient(supabaseUrl, supabaseKey);

    if (serviceKey && serviceKey !== 'your_supabase_service_key') {
      this.adminClientInstance = createClient(supabaseUrl, serviceKey);
    }
  }

  getClient() {
    return this.clientInstance;
  }

  getAdminClient() {
    if (!this.adminClientInstance) {
      this.logger.error('Admin client requested but SERVICE_KEY not provided');
      throw new Error('Admin client is not configured');
    }
    return this.adminClientInstance;
  }

  getAuthenticatedClient(token: string) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }

  async uploadFile(bucket: string, path: string, file: Buffer): Promise<any> {
    const { data, error } = await this.clientInstance.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      throw error;
    }
    return data;
  }
}
