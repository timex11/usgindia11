import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadFile(buffer: Buffer, path: string, mimetype: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .storage.from('files')
      .upload(path, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }

    return data;
  }

  getFileUrl(path: string) {
    const { data } = this.supabaseService
      .getClient()
      .storage.from('files')
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async deleteFile(path: string) {
    const { error } = await this.supabaseService
      .getClient()
      .storage.from('files')
      .remove([path]);

    if (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw error;
    }

    return { success: true };
  }
}
