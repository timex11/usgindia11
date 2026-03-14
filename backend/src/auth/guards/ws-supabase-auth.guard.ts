import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuthenticatedSocket } from '../../types/authenticated-request.interface';

@Injectable()
export class WsSupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsSupabaseAuthGuard.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();
    const auth = client.handshake?.auth;
    const headers = client.handshake?.headers;

    const token =
      (auth?.token as string | undefined) ||
      headers?.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);
      if (error || !data.user) {
        return false;
      }

      // Attach user to the client for later use
      client.user = {
        id: data.user.id,
        sub: data.user.id,
        email: data.user.email,
        role: (data.user.app_metadata?.role as string) || 'student',
      };
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`WS Auth Guard Error: ${errorMessage}`);
      return false;
    }
  }
}
