
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { findSpecializedVehicleById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Users, Briefcase, User, Mail, Phone, Banknote } from 'lucide-react';
import { addDays, differenceInDays, format } from 'date-fns';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import type { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function SpecializedVehicleConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const vehicleId = searchParams.get('vehicleId');
  const vehicle = findSpecializedVehicleById(Number(vehicleId));

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });
  const [totalCost, setTotalCost] = useState(0);
  
  const rentalDays = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;

  useEffect(() => {
    if (vehicle && rentalDays > 0) {
      setTotalCost(rentalDays * vehicle.pricePerDay);
    } else {
      setTotalCost(0);
    }
  }, [dateRange, vehicle, rentalDays]);

  if (!vehicle) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn't find the details for this vehicle. Please try again.</p>
          <Button onClick={() => router.push('/specialized')} className="mt-4">Go to Specialized Vehicles</Button>
        </CardContent>
      </Card>
    );
  }
  
  const handleConfirm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    if (!dateRange?.from || !dateRange?.to) {
        toast({
            title: "Error",
            description: "Please select valid travel dates.",
            variant: "destructive"
        });
        return;
    }
    
    // In a real app, you would process payment and save the reservation.
    // For this demo, we'll store it in localStorage.
    const newReservation = {
        id: Date.now(),
        vehicleId: vehicle.id,
        startDate: dateRange.from,
        endDate: dateRange.to,
        totalCost: totalCost,
        contactName: formData.get('contactName'),
    };
    
    const existingReservations = JSON.parse(localStorage.getItem('specializedVehicleReservations') || '[]');
    localStorage.setItem('specializedVehicleReservations', JSON.stringify([...existingReservations, newReservation]));

    toast({
        title: "Booking Confirmed!",
        description: `Your trip with the ${vehicle.name} is booked.`,
    });
    router.push('/reservations');
  }

  return (
    <form onSubmit={handleConfirm}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4 shadow-lg">
              <Image src={vehicle.images[0]} alt={vehicle.name} layout="fill" objectFit="cover" data-ai-hint="accessible vehicle" />
          </div>
          <h2 className="text-3xl font-bold font-headline">{vehicle.name}</h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-2"><Users className="h-4 w-4"/> {vehicle.capacity}</p>
          
          <Card className="mt-6">
            <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Enter the details for your booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>Travel Dates</Label>
                    <DatePickerWithRange onDateChange={setDateRange} initialDateRange={dateRange} className="w-full" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input id="contactName" name="contactName" placeholder="Your Name" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input id="contactEmail" name="contactEmail" type="email" placeholder="your@email.com" required />
                    </div>
                 </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Confirm Your Booking</CardTitle>
            <CardDescription>Please review the cost and confirm to proceed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4"/> Travel Dates</span>
                  <span className="font-medium">
                    {dateRange?.from && format(dateRange.from, 'MMM d, yyyy')} - {dateRange?.to && format(dateRange.to, 'MMM d, yyyy')}
                  </span>
              </div>
              <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4"/> Total Days</span>
                  <span className="font-medium">{rentalDays}</span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Price per day</span>
                <span>₹{vehicle.pricePerDay.toLocaleString()}</span>
              </div>
               <div className="flex items-center justify-between text-muted-foreground">
                <span>Number of days</span>
                <span>x {rentalDays}</span>
              </div>

              <Separator className="my-4" />
              <div className="flex items-center justify-between text-2xl font-bold">
                  <span>Total Cost</span>
                  <span>₹{totalCost.toLocaleString()}</span>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Banknote className="h-4 w-4" />Payment Information</h3>
                <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" required/>
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" required/>
                        <Input placeholder="CVC" required/>
                    </div>
                </div>
              </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg">
              <CheckCircle className="mr-2 h-5 w-5" />
              Confirm & Pay
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}


export default function SpecializedVehicleConfirmPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
       <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">Book Your Specialized Ride</h1>
            <p className="text-muted-foreground mt-2 text-lg">
            Finalize your booking for a safe and comfortable journey.
            </p>
        </div>
      <Suspense fallback={<div>Loading booking details...</div>}>
        <SpecializedVehicleConfirmationContent />
      </Suspense>
    </div>
  );
}
