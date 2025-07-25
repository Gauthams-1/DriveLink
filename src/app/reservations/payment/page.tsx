
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { findVehicleById, isVehicleAvailable, createReservation, getCurrentUser, updatePartnerVehicle, findOwnerOfVehicle } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Banknote, CreditCard, MapPin, Car as CarIcon, Loader2, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import type { AnyVehicle } from '@/lib/types';

function CarPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [vehicle, setVehicle] = useState<AnyVehicle | null>(null);
  const [loading, setLoading] = useState(true);

  const vehicleId = searchParams.get('vehicleId');
  const startDateStr = searchParams.get('startDate');
  const endDateStr = searchParams.get('endDate');
  const totalCost = searchParams.get('totalCost');
  const rentalDays = searchParams.get('rentalDays');
  const addons = searchParams.get('addons')?.split(',') || [];
  const driverAssistance = addons.includes('driver');

  useEffect(() => {
    if (vehicleId) {
      findVehicleById(vehicleId)
        .then(setVehicle)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [vehicleId]);

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentUser = getCurrentUser();

    if (!pickup || !dropoff) {
      toast({
        title: "Missing Information",
        description: "Please enter both pickup and drop-off locations.",
        variant: "destructive",
      });
      return;
    }

    if (!vehicle || !startDate || !endDate || !totalCost || currentUser.isGuest) {
      toast({ title: "Error", description: "Invalid booking details or not logged in.", variant: "destructive" });
      return;
    }
    
    // Final availability check before creating reservation
    const available = await isVehicleAvailable(vehicle.id, startDate, endDate);
    if (!available) {
        toast({
            title: "Booking Conflict",
            description: "Sorry, this car has just been booked for the selected dates. Please try different dates.",
            variant: "destructive",
        });
        router.push('/cars');
        return;
    }
    
    const newReservation = {
        userId: currentUser.email,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleCategory: vehicle.category,
        startDate: startDate,
        endDate: endDate,
        totalCost: parseFloat(totalCost),
        pickup: pickup,
        dropoff: dropoff,
        driverAssistance: driverAssistance,
    };
    
    try {
      await createReservation(newReservation);
      
      // Update vehicle status with renter info
      vehicle.status = 'Rented';
      vehicle.renter = {
        name: currentUser.name,
        email: currentUser.email,
        phone: contactPhone,
        rentalPeriod: `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
      }
      await updatePartnerVehicle(vehicle);

      toast({
          title: "Booking Confirmed!",
          description: `Your trip with the ${vehicle.name} is booked.`,
      });
      
      const tripParams = new URLSearchParams({
          pickup,
          dropoff,
          carName: vehicle.name,
          carImage: (vehicle.images && vehicle.images.length > 0) ? vehicle.images[0] : '',
      });

      router.push(`/reservations/trip-details?${tripParams.toString()}`);

    } catch (error) {
      console.error(error);
      toast({ title: "Booking Failed", description: "Could not save your reservation. Please try again.", variant: "destructive" });
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!vehicle || !startDate || !endDate || !totalCost || !rentalDays) {
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

  return (
    <form onSubmit={handleConfirm}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
           <h2 className="text-2xl font-bold font-headline mb-4">Your Booking Summary</h2>
           <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex gap-4 items-center">
                        <CarIcon className="h-10 w-10 text-primary" />
                        <div>
                            <h3 className="font-bold text-lg">{vehicle.name}</h3>
                            <p className="text-muted-foreground">{(vehicle as any).type}</p>
                        </div>
                    </div>
                     <Separator className="my-4" />
                     <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4"/> Travel Dates</span>
                            <span className="font-medium text-right">
                                {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')} ({rentalDays} days)
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total Cost</span>
                            <span>₹{parseFloat(totalCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </CardContent>
           </Card>
           
           <Card>
            <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>Where should we pick up and drop off the car?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                 <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone Number</Label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="contactPhone" name="contactPhone" type="tel" placeholder="e.g., 9876543210" required className="pl-10" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                    </div>
                </div>
            </CardContent>
           </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Select a payment method to complete your booking.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg">
              <CheckCircle className="mr-2 h-5 w-5" />
              Confirm & Pay ₹{parseFloat(totalCost).toLocaleString('en-IN')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}


export default function CarPaymentPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl animate-fade-in">
       <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">Complete Your Booking</h1>
            <p className="text-muted-foreground mt-2 text-lg">
                Secure your ride by completing the payment.
            </p>
        </div>
      <Suspense fallback={<div>Loading payment details...</div>}>
        <CarPaymentContent />
      </Suspense>
    </div>
  );
}
