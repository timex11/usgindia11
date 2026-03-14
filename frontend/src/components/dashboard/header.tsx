'use client'

import { Languages, Menu, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { UserNav } from '@/components/dashboard/user-nav'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getNavigation, getAdminNavigation } from '@/config/nav'
import { NotificationsDropdown } from './notifications'

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navigation = getNavigation(t);
  const adminNavigation = getAdminNavigation(t);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Enhanced Breadcrumbs
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`;
      const isLast = index === paths.length - 1;
      const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

      return (
        <span key={path} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/50" />
          {isLast ? (
            <span className="font-medium text-foreground">{title}</span>
          ) : (
            <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
              {title}
            </Link>
          )}
        </span>
      );
    });
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-6 px-4 sm:px-6 lg:px-8 transition-all duration-200",
      scrolled ? "bg-background/80 backdrop-blur-md shadow-sm border-b" : "bg-transparent border-b border-transparent"
    )}>
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        {/* Mobile Menu Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="-m-2.5 p-2.5 text-muted-foreground lg:hidden hover:text-foreground transition-colors">
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-background/95 backdrop-blur-md text-foreground border-border/50 w-[250px]">
            <div className="flex h-16 items-center border-b border-border/50 px-6">
              <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight" onClick={() => setOpen(false)}>
                <Image src="/logo.png" alt="USG India" width={32} height={32} className="rounded-lg object-contain shadow-sm" />
                USG India
              </Link>
            </div>
             <ScrollArea className="flex-1 py-4 h-[calc(100vh-4rem)]">
              <nav className="flex flex-col gap-1 px-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                        isActive 
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      {item.name}
                    </Link>
                  )
                })}

                <div className="my-4 px-2">
                  <div className="h-px bg-border/50" />
                  <h3 className="mt-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Administration
                  </h3>
                </div>

                {adminNavigation.map((item) => {
                   const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                   return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                        isActive 
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <div className="flex items-center text-sm">
           <Link href="/dashboard" className="hidden md:block font-bold text-foreground hover:opacity-80 transition-opacity">
             USG India
           </Link>
           {getBreadcrumbs()}
        </div>
      </div>
      
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <div className="flex items-center gap-x-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1 rounded-full px-3 py-1.5 text-xs font-medium bg-secondary/50 hover:bg-secondary text-secondary-foreground transition-all border border-transparent hover:border-border"
          >
            <Languages className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'EN' : 'HI'}</span>
          </button>
          
          <div className="h-6 w-px bg-border/50" aria-hidden="true" />

          <NotificationsDropdown />
        </div>

        <div className="h-6 w-px bg-border/50" aria-hidden="true" />
        
        <UserNav />
      </div>
    </header>
  )
}
