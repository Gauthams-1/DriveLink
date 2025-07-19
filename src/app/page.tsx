
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Car, Accessibility } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleGuestLogin = () => {
    // In a real app, you might have more complex guest logic
    // For now, we'll just navigate them to the car rental page
    router.push('/cars');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="mb-12 text-center">
        <Logo className="justify-center" />
        <h1 className="text-3xl md:text-4xl font-headline font-bold mt-4">
          Welcome to DriveLink
        </h1>
        <p className="text-muted-foreground mt-2">
          Your complete transportation solution. Please choose your portal to continue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <Card className="text-center hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col">
           <CardHeader className="flex-grow">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Car className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Rent a Vehicle</CardTitle>
            <CardDescription className="pt-2">
              Find and book cars, bikes, buses, and more for your journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="w-full" onClick={handleGuestLogin}>
              Browse as a Customer
            </Button>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col">
           <CardHeader className="flex-grow">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Accessibility className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Specialized Services</CardTitle>
             <CardDescription className="pt-2">
              Safe travel for special needs, including wheelchair access and pet-friendly options.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button size="lg" className="w-full" asChild>
                <Link href="/specialized">Explore Services</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col">
           <CardHeader className="flex-grow">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Handshake className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Partner Portal</CardTitle>
             <CardDescription className="pt-2">
              Manage your fleet, view earnings, and handle bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button size="lg" className="w-full" asChild>
                <Link href="/partner/login">Login or Sign Up as Partner</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
