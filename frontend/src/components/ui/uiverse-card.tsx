import React from 'react';
import { cn } from '@/lib/utils';

interface UiverseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function UiverseCard({ title, subtitle, icon, className, children, ...props }: UiverseCardProps) {
  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] hover:-translate-y-1 dark:bg-slate-900",
        className
      )} 
      {...props}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl transition-all duration-500 group-hover:scale-150" />
      
      <div className="relative z-10 flex items-start gap-4">
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          <div className="mt-4 text-slate-600 dark:text-slate-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
