'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Briefcase,
  BookOpen,
  Award,
  Users,
  Zap,
  MessageSquare,
  Settings,
  Shield,
  BarChart3,
  FileText,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const menuGroups = [
    {
      label: 'Main',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
      ],
    },
    {
      label: 'Features',
      items: [
        { href: '/jobs', label: 'Jobs', icon: Briefcase },
        { href: '/scholarships', label: 'Scholarships', icon: Award },
        { href: '/exams', label: 'Exams', icon: FileText },
        { href: '/resources', label: 'Resources', icon: BookOpen },
        { href: '/community', label: 'Community', icon: Users },
        { href: '/alumni', label: 'Alumni Network', icon: Users },
      ],
    },
    {
      label: 'Tools & Services',
      items: [
        { href: '/institutions', label: 'Institutions', icon: BarChart3 },
        { href: '/tools', label: 'Tools', icon: Zap },
        { href: '/ai', label: 'AI Assistant', icon: MessageSquare },
      ],
    },
    ...(user?.role === 'admin' || user?.role === 'super_admin'
      ? [
          {
            label: 'Administration',
            items: [
              { href: '/admin', label: 'Admin Panel', icon: Shield },
            ],
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-white sticky top-16 h-[calc(100vh-64px)] border-r border-slate-700 overflow-y-auto">
      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user.fullName || 'User'}
              </p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              <p className="text-xs text-blue-300 capitalize mt-1">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-4">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Actions Section */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <Link
          href="/profile"
          className={cn(
            'flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive('/profile')
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          )}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            'flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive('/settings')
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
