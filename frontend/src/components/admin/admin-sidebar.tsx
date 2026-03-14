'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Cpu, 
  FileEdit, 
  Settings,
  ShieldCheck,
  Activity,
  Database,
  ListOrdered
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AdminSidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/admin/overview' },
    { id: 'users', label: 'User Management', icon: Users, href: '/admin/users' },
    { id: 'ai-control', label: 'AI Control', icon: Cpu, href: '/admin/ai-console' },
    { id: 'cms', label: 'CMS Management', icon: FileEdit, href: '/admin/cms' },
    { id: 'system', label: 'System Logs', icon: Activity, href: '/admin/system' },
    { id: 'queues', label: 'Queues', icon: ListOrdered, href: '/admin/queues' },
    { id: 'database', label: 'Database', icon: Database, href: '/admin/database' },
    { id: 'security', label: 'Security', icon: ShieldCheck, href: '/admin/security' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          Admin Console
        </h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === '/admin' && item.id === 'overview');
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-indigo-600' : 'text-gray-400')} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100 mt-auto">
        <p className="text-xs text-center text-gray-400">USGIndia Admin v1.0</p>
      </div>
    </aside>
  );
};
