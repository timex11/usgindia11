import { useAuthStore } from '@/store/useAuthStore';
import { useMemo } from 'react';

const roleHierarchy: Record<string, number> = {
  super_admin: 100,
  system_admin: 90,
  university_admin: 80,
  college_admin: 70,
  department_admin: 60,
  moderator: 50,
  teacher: 40,
  student: 30,
  alumni: 20,
  public: 10,
};

export function useRole() {
  const { user } = useAuthStore();
  
  const currentRole = user?.role || 'public';
  const roleWeight = useMemo(() => roleHierarchy[currentRole] || 0, [currentRole]);

  const hasPermission = (requiredRole: string) => {
    const requiredWeight = roleHierarchy[requiredRole] || 0;
    return roleWeight >= requiredWeight;
  };

  const isAdmin = roleWeight >= roleHierarchy.department_admin;
  const isSuperAdmin = roleWeight >= roleHierarchy.super_admin;
  const isModerator = roleWeight >= roleHierarchy.moderator;

  return {
    role: currentRole,
    roleWeight,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    isModerator,
  };
}
