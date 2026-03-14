import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly roleHierarchy: Record<string, number> = {
    super_admin: 100,
    system_admin: 90,
    admin: 85, // Legacy support
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const user = request.user;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userRole = (user?.app_metadata?.role || user?.user_metadata?.role) as
      | string
      | string[];

    if (!userRole) {
      return false;
    }

    const userRoles = Array.isArray(userRole) ? userRole : [userRole];

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
