
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Car, Bus, Truck, Wrench, User } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/cars', label: 'Rentals', icon: Car },
  { href: '/bus-trips', label: 'Bus Trips', icon: Bus },
  { href: '/trucks', label: 'Trucks', icon: Truck },
  { href: '/support', label: 'Support', icon: Wrench },
  { href: '/reservations', label: 'My Bookings' },
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
            'text-sm font-medium transition-colors hover:text-primary flex items-center gap-2',
            pathname.startsWith(link.href) ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {link.icon && <link.icon className="h-4 w-4" />}
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4">
        <Link href="/">
            <Logo />
        </Link>
        
        <div className="ml-auto hidden md:flex items-center gap-6">
            <NavLinks />
        </div>

        <div className="ml-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
             <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
             </Link>
          </Button>
          <div className="flex items-center justify-end md:hidden">
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
        </div>
      </div>
    </header>
  );
}
