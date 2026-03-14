import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private configService: ConfigService) {
    this.fromAddress = this.configService.get<string>(
      'MAIL_FROM',
      'USG India <noreply@usgindia.com>',
    );

    const host = this.configService.get<string>('MAIL_HOST', 'smtp.resend.com');
    const port = this.configService.get<number>('MAIL_PORT', 465);
    const user = this.configService.get<string>('MAIL_USER', '');
    const pass = this.configService.get<string>('MAIL_PASSWORD', '');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user ? { user, pass } : undefined,
    });

    // Verify connection in background
    this.transporter.verify().then(
      () => this.logger.log('✅ Email transporter ready'),
      (err) =>
        this.logger.warn(
          `⚠️ Email transporter not ready: ${err.message}. Emails will fail until configured.`,
        ),
    );
  }

  async sendEmail(options: SendEmailOptions): Promise<{ messageId: string }> {
    try {
      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        cc: options.cc?.join(', '),
        bcc: options.bcc?.join(', '),
        attachments: options.attachments,
      });

      this.logger.log(
        `📧 Email sent to ${options.to} [${options.subject}] msgId=${info.messageId}`,
      );
      return { messageId: info.messageId };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send email to ${options.to}`, {
        subject: options.subject,
        error: err.message,
        stack: err.stack,
      });
      throw new HttpException(
        'Failed to send email. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // --- Convenience Methods ---

  async sendOtpEmail(to: string, otp: string, name?: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: `${otp} is your USG India verification code`,
      html: this.renderTemplate('otp', { otp, name: name || 'User' }),
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Welcome to USG India! 🎓',
      html: this.renderTemplate('welcome', { name }),
    });
  }

  async sendPasswordResetEmail(
    to: string,
    resetCode: string,
    name?: string,
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Reset your USG India password',
      html: this.renderTemplate('password-reset', {
        code: resetCode,
        name: name || 'User',
      }),
    });
  }

  async sendNotificationEmail(
    to: string,
    title: string,
    body: string,
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: title,
      html: this.renderTemplate('notification', { title, body }),
    });
  }

  // --- Template Engine ---

  private renderTemplate(
    template: string,
    data: Record<string, string>,
  ): string {
    const templates: Record<string, string> = {
      otp: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">USG India</h1>
            <p style="color: #a0aec0; margin: 8px 0 0;">National Education Infrastructure</p>
          </div>
          <div style="padding: 40px 32px; text-align: center;">
            <p style="color: #4a5568; font-size: 16px; margin: 0 0 24px;">Hi ${data.name},</p>
            <p style="color: #4a5568; font-size: 16px; margin: 0 0 24px;">Your verification code is:</p>
            <div style="background: #f7fafc; border: 2px dashed #4299e1; border-radius: 12px; padding: 24px; margin: 0 0 24px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a202c;">${data.otp}</span>
            </div>
            <p style="color: #718096; font-size: 14px; margin: 0;">This code expires in 10 minutes. Do not share it with anyone.</p>
          </div>
          <div style="background: #f7fafc; padding: 16px 32px; text-align: center;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2026 USG India. All rights reserved.</p>
          </div>
        </div>`,

      welcome: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 40px 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to USG India! 🎓</h1>
          </div>
          <div style="padding: 40px 32px;">
            <p style="color: #4a5568; font-size: 16px;">Hi <strong>${data.name}</strong>,</p>
            <p style="color: #4a5568; font-size: 16px;">Welcome aboard India's National Education Super Infrastructure! Here's what you can do:</p>
            <ul style="color: #4a5568; font-size: 14px; line-height: 2;">
              <li>🎯 Discover exams, scholarships & jobs</li>
              <li>🤖 Get AI-powered career guidance</li>
              <li>💬 Connect with students & alumni</li>
              <li>📚 Access learning resources</li>
            </ul>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background: linear-gradient(135deg, #4299e1, #667eea); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Go to Dashboard →</a>
            </div>
          </div>
          <div style="background: #f7fafc; padding: 16px 32px; text-align: center;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2026 USG India. All rights reserved.</p>
          </div>
        </div>`,

      'password-reset': `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #e53e3e, #c53030); padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔒 Password Reset</h1>
          </div>
          <div style="padding: 40px 32px; text-align: center;">
            <p style="color: #4a5568; font-size: 16px; margin: 0 0 16px;">Hi ${data.name},</p>
            <p style="color: #4a5568; font-size: 16px; margin: 0 0 24px;">Use this code to reset your password:</p>
            <div style="background: #fff5f5; border: 2px dashed #e53e3e; border-radius: 12px; padding: 24px; margin: 0 0 24px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a202c;">${data.code}</span>
            </div>
            <p style="color: #718096; font-size: 14px;">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
          </div>
          <div style="background: #f7fafc; padding: 16px 32px; text-align: center;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2026 USG India. All rights reserved.</p>
          </div>
        </div>`,

      notification: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 24px 32px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">USG India</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1a202c; font-size: 20px; margin: 0 0 16px;">${data.title}</h2>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">${data.body}</p>
          </div>
          <div style="background: #f7fafc; padding: 16px 32px; text-align: center;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">© 2026 USG India. All rights reserved.</p>
          </div>
        </div>`,
    };

    return templates[template] || `<p>${JSON.stringify(data)}</p>`;
  }
}
