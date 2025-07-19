import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Logo />
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} AutoNomad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
