
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { findBusById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Users, Briefcase, User, Mail, Phone, Banknote, CreditCard } from 'lucide-react';
import { addDays, differenceInDays, format } from 'date-fns';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import type { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
  const [paymentMethod, setPaymentMethod] = useState('card');
  
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
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Banknote className="h-4 w-4" />Payment Information</h3>
                 <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label htmlFor="card" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <CreditCard className="mb-3 h-6 w-6" />
                            Card
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                        <Label htmlFor="upi" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                             <div className="mb-3 h-6 w-6 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 6.34C7.83935 5.2323 9.07625 4.43384 10.5 4.07C11.9237 3.70616 13.4137 3.80587 14.77 4.35C16.1263 4.89413 17.2905 5.8569 18.11 7.1C18.9295 8.3431 19.375 9.80392 19.375 11.3C19.375 12.7961 18.9295 14.2569 18.11 15.5C17.2905 16.7431 16.1263 17.7059 14.77 18.25C13.4137 18.7941 11.9237 18.8938 10.5 18.53C9.07625 18.1662 7.83935 17.3677 7 16.26M10.5 12.4L13.5 15.4M4.625 11.3C4.625 9.80392 5.07054 8.3431 5.89 7.1C6.70946 5.8569 7.87368 4.89413 9.23 4.35C9.89512 4.0905 10.592 3.93172 11.3 3.88M11.3 18.72C10.592 18.6683 9.89512 18.5095 9.23 18.25C7.87368 17.7059 6.70946 16.7431 5.89 15.5C5.07054 14.2569 4.625 12.7961 4.625 11.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            UPI/QR
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="netbanking" id="netbanking" className="peer sr-only" />
                        <Label htmlFor="netbanking" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <Banknote className="mb-3 h-6 w-6" />
                            Netbanking
                        </Label>
                    </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" required/>
                      <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="MM/YY" required/>
                          <Input placeholder="CVC" required/>
                      </div>
                  </div>
                )}
                 {paymentMethod === 'upi' && (
                  <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input id="upi-id" placeholder="yourname@bank" required/>
                       <div className='flex items-center justify-center flex-col pt-4'>
                         <p className="text-muted-foreground text-sm mb-2">or scan QR code</p>
                          <div className='bg-white p-2 rounded-md w-32 h-32'>
                            <Image src="https://placehold.co/128x128.png" alt="QR Code" width={128} height={128} data-ai-hint="qr code"/>
                          </div>
                       </div>
                  </div>
                )}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2">
                      <Label htmlFor="bank">Select Bank</Label>
                      <select id="bank" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                        <option>Select your bank</option>
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                  </div>
                )}
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
