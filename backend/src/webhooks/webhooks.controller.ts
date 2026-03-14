import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  @Post('stripe')
  handleStripe(
    @Body() _body: unknown,
    @Headers('stripe-signature') _signature: string,
  ) {
    this.logger.log('Received Stripe Webhook');
    // Prevent unused variable error
    void _body;
    void _signature;
    // Real implementation: Verify signature with Stripe SDK
    return { received: true };
  }

  @Post('supabase')
  handleSupabase(@Body() body: { type?: string; [key: string]: unknown }) {
    this.logger.log(
      `Received Supabase Webhook: ${body.type || 'unknown_event'}`,
    );
    // Real implementation: Handle auth events, insert data, etc.
    return { received: true };
  }
}
