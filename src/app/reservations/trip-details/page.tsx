
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getRouteDetails, type GetRouteDetailsOutput } from '@/ai/flows/get-route-details';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Route, Fuel, Utensils, Construction } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function TripDetailsContent() {
    const searchParams = useSearchParams();
    const [details, setDetails] = useState<GetRouteDetailsOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const pickup = searchParams.get('pickup');
    const dropoff = searchParams.get('dropoff');
    const carName = searchParams.get('carName');
    const carImage = searchParams.get('carImage');

    useEffect(() => {
        if (pickup && dropoff) {
            setLoading(true);
            setError(null);
            getRouteDetails({ pickup, dropoff })
                .then(setDetails)
                .catch(err => {
                    console.error(err);
                    setError('Sorry, we couldn\'t get trip details at this time.');
                })
                .finally(() => setLoading(false));
        } else {
            setError('Pickup and drop-off locations are required.');
            setLoading(false);
        }
    }, [pickup, dropoff]);

    if (loading) {
        return (
            <div className="text-center py-16">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-semibold">Planning your trip...</h2>
                <p className="text-muted-foreground">Our AI is preparing your route details.</p>
            </div>
        );
    }
    
    if (error || !details) {
        return <div className="text-center text-destructive py-16">{error || 'Could not load trip details.'}</div>;
    }

    return (
        <div className="space-y-8">
            <Card className="overflow-hidden">
                <div className="grid md:grid-cols-3">
                    <div className="md:col-span-1 relative h-48 md:h-full">
                        <Image src={carImage || 'https://placehold.co/600x400.png'} alt={carName || 'Car'} layout="fill" objectFit="cover" data-ai-hint="car" />
                    </div>
                    <div className="md:col-span-2 p-6">
                        <CardTitle className="text-2xl font-headline">Your Trip with the {carName}</CardTitle>
                        <p className="text-muted-foreground mt-2">From <span className="font-semibold text-primary">{pickup}</span> to <span className="font-semibold text-primary">{dropoff}</span></p>
                        <div className="mt-6 flex gap-4">
                            <Button asChild><Link href="/reservations">View All Bookings</Link></Button>
                            <Button variant="outline">Share Trip Details</Button>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Route className="text-primary"/> Suggested Routes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {details.suggestedRoutes.map((route, index) => (
                            <div key={index}>
                                <h4 className="font-semibold">{route.name}</h4>
                                <p className="text-sm text-muted-foreground">{route.description}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Fuel className="text-primary"/> Petrol Pumps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            {details.petrolPumps.map((pump, index) => (
                                <li key={index}>
                                    <span className="font-semibold text-foreground">{pump.name}</span> ({pump.brand})
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Utensils className="text-primary"/> Restaurants</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            {details.restaurants.map((r, index) => (
                                <li key={index}>
                                    <span className="font-semibold text-foreground">{r.name}</span> - {r.cuisine}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card className="md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Construction className="text-primary"/> Road Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{details.roadConditions}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function TripDetailsPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">Your Journey Plan</h1>
                <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
                    Here are the AI-powered details for your upcoming road trip. Drive safe!
                </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <TripDetailsContent />
            </Suspense>
        </div>
    );
}
