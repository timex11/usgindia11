import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function NeumorphicButton({ className, children, ...props }: NeumorphicButtonProps) {
  return (
    <Button
      className={cn(
        "relative overflow-hidden rounded-xl border-none bg-slate-100 px-8 py-4 text-slate-800 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] transition-all hover:shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] active:scale-95 dark:bg-slate-800 dark:text-slate-100 dark:shadow-[5px_5px_10px_#0f172a,-5px_-5px_10px_#1e293b] dark:hover:shadow-[inset_5px_5px_10px_#0f172a,inset_-5px_-5px_10px_#1e293b]",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
