
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { findCarById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Shield, Package, MapPin, Car as CarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Car } from '@/lib/types';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


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
  
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  const car = findCarById(Number(carId));
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('confirmed');
        window.history.replaceState({}, '', url);
    }
  }, []);

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

  const getPaymentUrl = () => {
    if (!pickup || !dropoff) return '#';
    const params = new URLSearchParams(searchParams.toString());
    params.set('pickup', pickup);
    params.set('dropoff', dropoff);
    return `/reservations/payment?${params.toString()}`;
  }
  
  const handleProceedToPayment = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!pickup || !dropoff) {
      e.preventDefault();
      toast({
        title: "Missing Information",
        description: "Please enter both pickup and drop-off locations.",
        variant: "destructive",
      });
    }
  }

  const addonDetails = [
      { id: 'insurance', label: 'Full Insurance' },
      { id: 'gps', label: 'GPS Navigation' },
      { id: 'child-seat', label: 'Child Seat' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <Card className="mb-6">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CarIcon className="w-6 h-6" />
                <span>{car.name}</span>
              </CardTitle>
              <CardDescription>{car.type}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Route Details</CardTitle>
                <CardDescription>Where should we pick up and drop off the car?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="pickup">Pickup Location</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="pickup" name="pickup" placeholder="e.g., Chhatrapati Shivaji Maharaj Int'l Airport" required className="pl-10" value={pickup} onChange={(e) => setPickup(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dropoff">Drop-off Location</Label>
                     <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="dropoff" name="dropoff" placeholder="e.g., The Taj Mahal Palace, Mumbai" required className="pl-10" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
                    </div>
                </div>
            </CardContent>
        </Card>
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
            
            {addons.length > 0 && addons[0] !== '' && (
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
                <span>₹{parseFloat(totalCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" asChild>
            <Link href={getPaymentUrl()} onClick={handleProceedToPayment}>
              <CheckCircle className="mr-2 h-5 w-5" />
              Proceed to Payment
            </Link>
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
