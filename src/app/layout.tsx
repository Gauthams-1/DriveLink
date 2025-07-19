
'use client';

import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPortalPage = pathname === '/' || pathname === '/login' || pathname.startsWith('/partner/login');

  const metadata: Metadata = {
    title: "DriveLink",
    description: "Your complete transportation solution.",
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased flex flex-col"
        )}
      >
        {!isPortalPage && <Header />}
        <main className="flex-grow">{children}</main>
        {!isPortalPage && <Footer />}
        <Toaster />
      </body>
    </html>
  );
}
