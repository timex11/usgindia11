import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async generateOtp(
    identifier: string,
    type: 'registration' | 'login' | 'password_reset',
    method: 'email' | 'phone' = 'email',
  ): Promise<string> {
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    await this.prisma.otpVerification.create({
      data: {
        email: method === 'email' ? identifier : null,
        phone: method === 'phone' ? identifier : null,
        code,
        type,
        expiresAt,
      },
    });

    if (method === 'email') {
      await this.sendEmailOtp(identifier, code);
    } else {
      await this.sendSmsOtp(identifier, code);
    }

    return code;
  }

  async verifyOtp(
    identifier: string,
    code: string,
    type: string,
    method: 'email' | 'phone' = 'email',
  ): Promise<boolean> {
    const record = await this.prisma.otpVerification.findFirst({
      where: {
        [method]: identifier,
        code,
        type,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return false;
    }

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return true;
  }

  private async sendEmailOtp(email: string, code: string) {
    this.logger.log(`[OTP] Sending email to ${email} with code ${code}`);
    await Promise.resolve();
    // Real integration would happen here
  }

  private async sendSmsOtp(phone: string, code: string) {
    this.logger.log(`[OTP] Sending SMS to ${phone} with code ${code}`);
    await Promise.resolve();
    const apiKey = this.configService.get<string>('FAST2SMS_API_KEY');
    if (apiKey) {
      this.logger.log(`Using API Key: ${apiKey.substring(0, 5)}...`);
    }
  }
}
