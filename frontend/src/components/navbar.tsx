'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Menu,
  Home,
  Award,
  FileText,
  Bell,
  User,
  BarChart3,
  Zap,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = !!user;

  const publicLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: BookOpen },
    { href: '/scholarships', label: 'Scholarships', icon: Award },
  ];

  const dashboardLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/exams', label: 'Exams', icon: FileText },
    { href: '/scholarships', label: 'Scholarships', icon: Award },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/resources', label: 'Resources', icon: BookOpen },
    { href: '/alumni', label: 'Alumni', icon: Users },
    { href: '/universities', label: 'Institutions', icon: BarChart3 },
    { href: '/tools', label: 'Tools', icon: Zap },
    { href: '/ai', label: 'AI Assistant', icon: MessageSquare },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Admin Panel', icon: Shield },
  ];

  const userLinks = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/support', label: 'Support', icon: MessageSquare },
  ];

  const links = isAuthenticated ? dashboardLinks : publicLinks;
  const adminLink = isAuthenticated ? adminLinks : [];
  const userActionsLinks = isAuthenticated ? userLinks : [];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Image
                src="/logo.png"
                alt="USG India"
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="font-bold text-lg hidden sm:inline text-foreground tracking-tight group-hover:text-primary transition-colors">USG India</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Admin Link */}
            {adminLink.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-destructive/10 text-destructive'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary hidden sm:flex rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
              </Button>
            )}

            {/* Auth Buttons / User Menu */}
            {isAuthenticated ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden lg:flex items-center space-x-1">
                  {userActionsLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isActive(link.href)
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                  <div className="h-4 w-px bg-border mx-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>

                {/* Mobile: Just show user avatar button */}
                <div className="lg:hidden">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-foreground border border-border">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link href="/join" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
                  Join
                </Link>
                <Link href="/(auth)/login">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 shadow-sm transition-transform hover:scale-105 active:scale-95">
                    Login
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <MobileMenu
                links={links}
                adminLinks={adminLink}
                userLinks={userActionsLinks}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface LinkItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileMenuProps {
  readonly links: LinkItem[];
  readonly adminLinks: LinkItem[];
  readonly userLinks: LinkItem[];
  readonly isAuthenticated: boolean;
  readonly onLogout: () => void;
  readonly isOpen: boolean;
  readonly setIsOpen: (open: boolean) => void;
}

function MobileMenu({
  links,
  adminLinks,
  userLinks,
  isAuthenticated,
  onLogout,
  isOpen,
  setIsOpen,
}: Readonly<MobileMenuProps>) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary rounded-full transition-colors">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:w-80 bg-background border-l border-border p-0">
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
             <Link href="/" className="flex items-center space-x-2 shrink-0 group" onClick={() => setIsOpen(false)}>
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="USG India"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">USG India</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {/* Main Navigation Links */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-3 tracking-wider">
                Navigation
              </p>
              {links.map((link) => {
                const Icon = link.icon;
                return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                        isActive(link.href)
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                );
              })}
            </div>

            {/* Admin Links */}
            {adminLinks.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-3 tracking-wider">
                  Admin
                </p>
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive(link.href)
                            ? 'bg-destructive/10 text-destructive font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </Link>
                  );
                })}
              </div>
            )}

            {/* User Links / Auth */}
            {isAuthenticated ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-3 tracking-wider">
                  Account
                </p>
                {userLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive(link.href)
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Mobile Footer / Auth Actions */}
          <div className="p-4 border-t border-border mt-auto">
             {isAuthenticated ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
             ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/join" className="block w-full">
                    <Button variant="outline" className="w-full rounded-xl" onClick={() => setIsOpen(false)}>
                      Join
                    </Button>
                  </Link>
                  <Link href="/(auth)/login" className="block w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl" onClick={() => setIsOpen(false)}>
                      Login
                    </Button>
                  </Link>
                </div>
             )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
