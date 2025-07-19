
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Search' },
  { href: '/recommendations', label: 'AI Assistant' },
  { href: '/reservations', label: 'My Reservations' },
];

export function Header() {
  const pathname = usePathname();

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === link.href ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4">
        <div className="hidden md:flex items-center gap-6">
            <Link href="/">
              <Logo />
            </Link>
            <NavLinks />
        </div>
        <div className="flex md:hidden items-center">
             <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left">
                <div className="flex flex-col gap-4 p-4">
                    <Logo />
                    <NavLinks className="flex-col space-x-0 space-y-2 items-start" />
                </div>
                </SheetContent>
            </Sheet>
        </div>
        <div className="flex flex-1 items-center justify-end md:hidden">
            <Link href="/">
                <Logo />
            </Link>
        </div>
      </div>
    </header>
  );
}
