"use client";

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getNavigation, getAdminNavigation } from '@/config/nav'

export function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navigation = getNavigation(t);
  const adminNavigation = getAdminNavigation(t);

  return (
    <div className="hidden border-r border-border/50 bg-background/95 backdrop-blur-md text-foreground md:block md:w-[250px] shadow-sm z-50">
      <div className="flex h-full flex-col">
        {/* Logo Area */}
        <div className="flex h-16 items-center px-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
            <Image src="/logo.png" alt="USG India" width={32} height={32} className="rounded-xl object-contain shadow-sm" />
            <span>USG India</span>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-6">
          <nav className="flex flex-col gap-1 px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.name}
                </Link>
              )
            })}

            <div className="my-6 px-2">
              <div className="h-px bg-border/50" />
              <h3 className="mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Administration
              </h3>
            </div>

            {adminNavigation.map((item) => {
               const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
               return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        
        {/* User Info Footer */}
        <div className="p-4 bg-background/50 backdrop-blur-md border-t border-border/50">
           <div className="rounded-xl bg-secondary/30 p-4 border border-border/50 shadow-sm">
             <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Need Help?
             </h4>
             <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Our support team is available 24/7 for you.</p>
             <Link href="/support" className="text-xs text-primary hover:text-primary/80 font-semibold hover:underline">Get Support &rarr;</Link>
           </div>
        </div>
      </div>
    </div>
  )
}
