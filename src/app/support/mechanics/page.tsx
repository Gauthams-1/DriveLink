
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { findMechanics } from '@/ai/flows/find-mechanic';
import type { Mechanic } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Star, Phone, MessageSquare, MapPin, User } from 'lucide-react';

function MechanicsList() {
    const searchParams = useSearchParams();
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const location = searchParams.get('location');
    const problemDescription = searchParams.get('problemDescription');

    useEffect(() => {
        if (location && problemDescription) {
            setLoading(true);
            setError(null);
            findMechanics({ location, problemDescription })
                .then(setMechanics)
                .catch(err => {
                    console.error(err);
                    setError('Sorry, we couldn\'t find mechanics at this time. Please try again.');
                })
                .finally(() => setLoading(false));
        } else {
            setError('Location and problem description are required.');
            setLoading(false);
        }
    }, [location, problemDescription]);

    if (loading) {
        return (
            <div className="text-center py-16">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-semibold">Finding nearby mechanics...</h2>
                <p className="text-muted-foreground">Our AI is on the job!</p>
            </div>
        );
    }
    
    if (error) {
        return <div className="text-center text-destructive py-16">{error}</div>;
    }

    if (mechanics.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-2">No mechanics found</h2>
                <p className="text-muted-foreground">We couldn't find any available mechanics for your request. Please try a different location.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {mechanics.map((mechanic) => (
                <Card key={mechanic.id} className="bg-primary/5 border-primary/20 animate-in fade-in-50">
                     <CardHeader className="text-center sm:text-left">
                        <div className="flex flex-col items-center sm:flex-row gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center ring-4 ring-primary">
                                    <User className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <div className="absolute -bottom-2 -right-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 flex items-center gap-1 text-sm">
                                    <Star className="w-3 h-3 fill-current" /> {mechanic.rating}
                                </div>
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl">{mechanic.name}</CardTitle>
                                <p className="text-muted-foreground">{mechanic.specialty}</p>
                                <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                                    <MapPin className="w-4 h-4"/>
                                    {mechanic.location}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center bg-background/50 p-4 rounded-lg">
                            <p className="font-semibold">Reason for selection:</p>
                            <p className="text-muted-foreground text-sm">{mechanic.reasoning}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-4">
                        <Button className="w-full" size="lg">
                            <Phone className="mr-2 h-5 w-5" /> Call Now ({mechanic.phone})
                        </Button>
                        <Button variant="secondary" className="w-full" size="lg">
                            <MessageSquare className="mr-2 h-5 w-5" /> Chat with Mechanic
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export default function MechanicsPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">Available Mechanics</h1>
                <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
                    Here are the top mechanics we found for you. Help is on the way!
                </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <MechanicsList />
            </Suspense>
        </div>
    );
}
