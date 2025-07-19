
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { findCarById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Shield, Package } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

type ReservationCar = {
  id: number;
  name: string;
  pricePerDay: number;
  images: string[];
};

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const carId = searchParams.get('carId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const totalCost = searchParams.get('totalCost');
  const rentalDays = searchParams.get('rentalDays');
  const addons = searchParams.get('addons')?.split(',') || [];

  const car = findCarById(Number(carId)) as ReservationCar | undefined;

  if (!car || !startDate || !endDate || !totalCost || !rentalDays) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid Reservation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn't find the details for your reservation. Please try again.</p>
          <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
        </CardContent>
      </Card>
    );
  }

  const handleConfirm = () => {
    // In a real app, you would save this to the database.
    toast({
        title: "Reservation Confirmed!",
        description: `Your booking for the ${car.name} is complete.`,
    });
    // Redirect to the main reservations page
    router.push('/reservations');
  }

  const addonDetails = [
      { id: 'insurance', label: 'Full Insurance' },
      { id: 'gps', label: 'GPS Navigation' },
      { id: 'child-seat', label: 'Child Seat' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
            <Image src={car.images[0]} alt={car.name} layout="fill" objectFit="cover" data-ai-hint="car" />
        </div>
        <h2 className="text-2xl font-bold font-headline">{car.name}</h2>
        <p className="text-muted-foreground">Your selected vehicle for the trip.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Confirm Your Booking</CardTitle>
          <CardDescription>Please review the details below before confirming.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4"/> Rental Period</span>
                <span className="font-medium">{format(new Date(startDate), 'MMM d, yyyy')} - {format(new Date(endDate), 'MMM d, yyyy')}</span>
            </div>
             <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4"/> Total Days</span>
                <span className="font-medium">{rentalDays}</span>
            </div>
            
            {addons.length > 0 && (
                <div>
                    <Separator className="my-4" />
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Package className="h-4 w-4" />Selected Add-ons</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {addons.map(addonId => {
                            const addon = addonDetails.find(a => a.id === addonId);
                            return addon ? <li key={addonId}>{addon.label}</li> : null;
                        })}
                    </ul>
                </div>
            )}

            <Separator className="my-4" />
            <div className="flex items-center justify-between text-xl font-bold">
                <span>Total Cost</span>
                <span>₹{parseFloat(totalCost).toFixed(2)}</span>
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handleConfirm}>
            <CheckCircle className="mr-2 h-5 w-5" />
            Confirm Reservation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function ReservationConfirmPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
       <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">Almost There!</h1>
            <p className="text-muted-foreground mt-2 text-lg">
            Finalize your booking and get ready for the road.
            </p>
        </div>
      <Suspense fallback={<div>Loading reservation details...</div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
