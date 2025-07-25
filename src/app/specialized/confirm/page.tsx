
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { findVehicleById, createReservation, getCurrentUser } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Banknote, CreditCard, HeartHandshake, Accessibility, Loader2 } from 'lucide-react';
import { addDays, differenceInDays, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import type { DateRange } from 'react-day-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import type { SpecializedVehicle } from '@/lib/types';

const CARETAKER_PRICE_PER_DAY = 2000;

function SpecializedVehicleConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const vehicleId = searchParams.get('vehicleId');
  const [vehicle, setVehicle] = useState<SpecializedVehicle | null>(null);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });
  const [totalCost, setTotalCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [caretakerAssistance, setCaretakerAssistance] = useState(false);
  
  useEffect(() => {
    if (vehicleId) {
      findVehicleById(vehicleId)
        .then(v => {
          if (v?.category === 'Specialized') {
            setVehicle(v as SpecializedVehicle);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [vehicleId]);

  const rentalDays = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
  const caretakerCost = caretakerAssistance && rentalDays > 0 ? rentalDays * CARETAKER_PRICE_PER_DAY : 0;

  useEffect(() => {
    if (vehicle && rentalDays > 0) {
      const baseCost = rentalDays * vehicle.pricePerDay;
      const finalCaretakerCost = caretakerAssistance ? rentalDays * CARETAKER_PRICE_PER_DAY : 0;
      setTotalCost(baseCost + finalCaretakerCost);
    } else {
      setTotalCost(0);
    }
  }, [dateRange, vehicle, rentalDays, caretakerAssistance]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

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
  
  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentUser = getCurrentUser();
    
    if (!dateRange?.from || !dateRange?.to) {
        toast({
            title: "Error",
            description: "Please select valid travel dates.",
            variant: "destructive"
        });
        return;
    }
    
    if (currentUser.isGuest) {
      toast({ title: "Please Login", description: "You need to be logged in to make a reservation.", variant: "destructive" });
      router.push('/login');
      return;
    }

    const newReservation = {
        userId: currentUser.email,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleCategory: vehicle.category,
        startDate: dateRange.from,
        endDate: dateRange.to,
        totalCost: totalCost,
        contactName: formData.get('contactName') as string,
        caretakerAssistance: caretakerAssistance,
    };
    
    try {
      await createReservation(newReservation);
      toast({
          title: "Booking Confirmed!",
          description: `Your trip with the ${vehicle.name} is booked.`,
      });
      router.push('/reservations');
    } catch (error) {
      console.error(error);
      toast({ title: "Booking Failed", description: "Could not save reservation.", variant: "destructive" });
    }
  }

  return (
    <form onSubmit={handleConfirm}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="w-6 h-6" />
                <span>{vehicle.name}</span>
              </CardTitle>
              <CardDescription>{vehicle.capacity}</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
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
                  <div className="space-y-2 pt-2">
                    <Label>Add-ons</Label>
                     <div className="flex items-center space-x-2 rounded-md border p-3">
                        <Checkbox 
                        id="caretaker"
                        checked={caretakerAssistance}
                        onCheckedChange={(checked) => setCaretakerAssistance(checked as boolean)}
                        />
                        <Label htmlFor="caretaker" className="font-normal flex justify-between w-full">
                        <span className="flex items-center gap-2"><HeartHandshake className="h-4 w-4"/> Caretaker Assistance</span>
                        <span className="text-muted-foreground">₹{CARETAKER_PRICE_PER_DAY}/day</span>
                        </Label>
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

                {caretakerCost > 0 && (
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span>Caretaker Assistance</span>
                        <span>₹{caretakerCost.toLocaleString()}</span>
                    </div>
                )}

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
                            <Image src="https://placehold.co/128x128.png" alt="QR Code" width={128} height={128} data-ai-hint="qr code" />
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


export default function SpecializedVehicleConfirmPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl animate-fade-in">
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
