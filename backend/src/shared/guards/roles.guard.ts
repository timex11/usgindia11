import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedRequest } from '../types/authenticated-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly roleHierarchy: Record<string, number> = {
    // Standard User Roles
    PLATFORM_ADMIN: 100,
    INSTITUTION_ADMIN: 80,
    RECRUITER: 70,
    FACULTY: 60,
    ALUMNI: 50,
    STUDENT: 40,
    CREATOR: 30,

    // Legacy Support Roles
    super_admin: 100,
    system_admin: 90,
    admin: 85,
    university_admin: 80,
    college_admin: 70,
    department_admin: 60,
    moderator: 50,
    teacher: 40,
    student: 30,
    alumni: 20,
    public: 10,
  };

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    const userRoles = Array.isArray(user.role) ? user.role : [user.role];

    // Check if any of user's roles satisfy the required role (either exact match or higher in hierarchy)
    return requiredRoles.some((reqRole) => {
      const reqRoleWeight = this.roleHierarchy[reqRole] || 0;
      return userRoles.some((uRole) => {
        const uRoleWeight = this.roleHierarchy[uRole] || 0;
        return uRoleWeight >= reqRoleWeight;
      });
    });
  }
}
