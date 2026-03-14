import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.id) {
      return false;
    }

    // Check if user has all required permissions
    // Optimization: In a real production system, we'd cache this or load it in the AuthGuard
    // For now, we query the DB to ensure RBAC is dynamic and accurate.
    const userProfile = await this.prisma.profile.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userProfile) {
      throw new ForbiddenException('User profile not found');
    }

    const userPermissions = new Set<string>();
    userProfile.roles.forEach((assignment) => {
      assignment.role.permissions.forEach((rp) => {
        userPermissions.add(rp.permission.slug);
      });
    });

    // Also support the legacy 'PLATFORM_ADMIN' from the enum bypass if needed
    if (userProfile.role === 'PLATFORM_ADMIN') {
      return true;
    }

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
