import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly provider: string;
  private readonly authKey: string;

  constructor(private configService: ConfigService) {
    this.provider = this.configService.get<string>('SMS_PROVIDER', 'msg91');
    this.authKey = this.configService.get<string>('MSG91_AUTH_KEY', '');
  }

  async sendSms(phone: string, message: string): Promise<void> {
    if (!this.authKey) {
      this.logger.warn(
        `SMS not configured — would have sent to ${phone}: ${message}`,
      );
      return;
    }

    try {
      if (this.provider === 'msg91') {
        await this.sendViaMsg91(phone, message);
      } else {
        this.logger.warn(`Unknown SMS provider: ${this.provider}`);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(`Failed to send SMS to ${phone}: ${error.message}`);
      // Don't throw — SMS is best-effort
    }
  }

  async sendOtpSms(phone: string, otp: string): Promise<void> {
    await this.sendSms(
      phone,
      `Your USG India verification code is: ${otp}. Valid for 10 minutes.`,
    );
  }

  private async sendViaMsg91(phone: string, message: string): Promise<void> {
    const url = 'https://control.msg91.com/api/v5/flow/';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: this.authKey,
      },
      body: JSON.stringify({
        template_id: this.configService.get<string>('MSG91_TEMPLATE_ID', ''),
        short_url: '0',
        mobiles: phone.startsWith('91') ? phone : `91${phone}`,
        var: message,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `MSG91 API error: ${response.status} ${response.statusText}`,
      );
    }

    this.logger.log(`📱 SMS sent to ${phone}`);
  }
}
