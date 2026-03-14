import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '@/supabase/supabase.service';
import { AuthenticatedSocket } from '@shared/types/authenticated-request.interface';

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

      const anyUser: any = data.user;

      // Attach user to the client for later use
      client.user = {
        id: data.user.id,
        sub: data.user.id,
        email: data.user.email,
        role: ((): string => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const r1 = anyUser.app_metadata?.role as string;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const r2 = anyUser.user_metadata?.role as string;
          return r1 || r2 || 'student';
        })(),
        collegeId: ((): string => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          return anyUser.user_metadata?.collegeId as string;
        })(),
      };
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`WS Auth Guard Error: ${errorMessage}`);
      return false;
    }
  }
}
