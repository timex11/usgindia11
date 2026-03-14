import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import axios from 'axios';

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);
  private r2Client: S3Client | null = null;
  private readonly accountId: string;
  private readonly bucketName: string;
  private readonly turnstileSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.accountId =
      this.configService.get<string>('CLOUDFLARE_ACCOUNT_ID') || '';
    this.bucketName =
      this.configService.get<string>('CLOUDFLARE_R2_BUCKET') || '';
    this.turnstileSecret =
      this.configService.get<string>('CLOUDFLARE_TURNSTILE_SECRET_KEY') || '';

    const accessKey = this.configService.get<string>(
      'CLOUDFLARE_R2_ACCESS_KEY',
    );
    const secretKey = this.configService.get<string>(
      'CLOUDFLARE_R2_SECRET_KEY',
    );

    if (this.accountId && accessKey && secretKey) {
      this.r2Client = new S3Client({
        region: 'auto',
        endpoint: `https://${this.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
      });
      this.logger.log('Cloudflare R2 client initialized');
    } else {
      this.logger.warn(
        'Cloudflare R2 configuration missing, R2 features will be disabled',
      );
    }
  }

  /**
   * Verifies a Cloudflare Turnstile token.
   */
  async verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
    if (!this.turnstileSecret) {
      this.logger.warn(
        'Turnstile secret missing, skipping verification (ALWAYS TRUE)',
      );
      return true;
    }

    try {
      const response = await axios.post<{ success: boolean }>(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          secret: this.turnstileSecret,
          response: token,
          remoteip: remoteIp,
        },
      );

      return response.data.success === true;
    } catch (error) {
      this.logger.error(
        `Turnstile verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }

  /**
   * Uploads a file to Cloudflare R2.
   */
  async uploadFile(
    path: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<string | null> {
    if (!this.r2Client || !this.bucketName) {
      this.logger.error('R2 client not initialized or bucket name missing');
      return null;
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: path,
        Body: buffer,
        ContentType: contentType,
      });

      await this.r2Client.send(command);

      // Return the public URL if configured, or just the path
      return `https://${this.bucketName}.${this.accountId}.r2.dev/${path}`;
    } catch (error) {
      this.logger.error(
        `R2 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return null;
    }
  }

  /**
   * Deletes a file from Cloudflare R2.
   */
  async deleteFile(path: string): Promise<boolean> {
    if (!this.r2Client || !this.bucketName) return false;

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: path,
      });

      await this.r2Client.send(command);
      return true;
    } catch (error) {
      this.logger.error(
        `R2 deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }
}
