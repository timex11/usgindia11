import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthenticatedRequest } from '@shared/types/authenticated-request.interface';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No bearer token found');
    }

    const user = await this.authService.validateUser(token);
    const { roles, permissions } = await this.authService.getUserPermissions(
      user.id,
    );

    const anyUser: any = user;

    request.user = {
      id: user.id,
      sub: user.id,
      email: user.email,
      role: ((): string => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const r1 = anyUser.app_metadata?.role as string;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const r2 = anyUser.user_metadata?.role as string;
        return r1 || r2 || (roles.length > 0 ? roles[0] : 'student');
      })(),
      roles,
      permissions,
      collegeId: ((): string => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return anyUser.user_metadata?.collegeId as string;
      })(),
    };
    return true;
  }
}
