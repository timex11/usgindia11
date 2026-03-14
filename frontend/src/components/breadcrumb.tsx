'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: Readonly<{ items?: BreadcrumbItem[] }>) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname
      .split('/')
      .filter((segment) => segment && segment !== '(dashboard)' && segment !== 'public');

    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment
        .charAt(0)
        .toUpperCase() + segment.slice(1).replaceAll('-', ' ');

      return {
        label,
        href: index < segments.length - 1 ? href : undefined,
      };
    });
  };

  const breadcrumbs = items || generateBreadcrumbs();

  if (!breadcrumbs.length) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm">
      <Link
        href="/dashboard"
        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((item) => (
        <div key={item.href || item.label} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4 text-slate-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
