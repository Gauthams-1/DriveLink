
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { findBusById } from '@/lib/data';
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

function BusConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const busId = searchParams.get('busId');
  const bus = findBusById(Number(busId));

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });
  const [totalCost, setTotalCost] = useState(0);
  
  const rentalDays = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;

  useEffect(() => {
    if (bus && rentalDays > 0) {
      setTotalCost(rentalDays * bus.pricePerDay);
    } else {
      setTotalCost(0);
    }
  }, [dateRange, bus, rentalDays]);

  if (!bus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid Bus Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We couldn't find the details for this bus. Please try again.</p>
          <Button onClick={() => router.push('/bus-trips')} className="mt-4">Go to Bus Trips</Button>
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
        busId: bus.id,
        startDate: dateRange.from,
        endDate: dateRange.to,
        totalCost: totalCost,
        groupName: formData.get('groupName'),
        contactName: formData.get('contactName'),
    };
    
    const existingReservations = JSON.parse(localStorage.getItem('busReservations') || '[]');
    localStorage.setItem('busReservations', JSON.stringify([...existingReservations, newReservation]));

    toast({
        title: "Booking Confirmed!",
        description: `Your group trip with the ${bus.name} is booked.`,
    });
    router.push('/reservations');
  }

  return (
    <form onSubmit={handleConfirm}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4 shadow-lg">
              <Image src={bus.images[0]} alt={bus.name} layout="fill" objectFit="cover" data-ai-hint="bus" />
          </div>
          <h2 className="text-3xl font-bold font-headline">{bus.name}</h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-2"><Users className="h-4 w-4"/> Up to {bus.seats} passengers</p>
          
          <Card className="mt-6">
            <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Enter the details for your group booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>Travel Dates</Label>
                    <DatePickerWithRange onDateChange={setDateRange} initialDateRange={dateRange} className="w-full" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="groupName">Group/Company Name</Label>
                    <Input id="groupName" name="groupName" placeholder="e.g., Acme Corporation" required />
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
                <span>₹{bus.pricePerDay.toLocaleString()}</span>
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


export default function BusReservationConfirmPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
       <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">Book Your Group Trip</h1>
            <p className="text-muted-foreground mt-2 text-lg">
            Finalize your booking and get your group ready for an adventure.
            </p>
        </div>
      <Suspense fallback={<div>Loading booking details...</div>}>
        <BusConfirmationContent />
      </Suspense>
    </div>
  );
}
