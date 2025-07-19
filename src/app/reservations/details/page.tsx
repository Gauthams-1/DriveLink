
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

function RouteDetailsForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const pickup = formData.get('pickup') as string;
        const dropoff = formData.get('dropoff') as string;

        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('pickup', pickup);
        newParams.set('dropoff', dropoff);

        router.push(`/reservations/confirm?${newParams.toString()}`);
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Route Details</CardTitle>
                    <CardDescription>Where should we pick up and drop off the car?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="pickup">Pickup Location</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="pickup" name="pickup" placeholder="e.g., Chhatrapati Shivaji Maharaj Int'l Airport" required className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dropoff">Drop-off Location</Label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="dropoff" name="dropoff" placeholder="e.g., The Taj Mahal Palace, Mumbai" required className="pl-10" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">Proceed to Confirmation</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function ReservationDetailsPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline">Enter Your Trip Details</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Let us know your route to finalize your booking.
                </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <RouteDetailsForm />
            </Suspense>
        </div>
    );
}
