
'use client';

import { notFound, useRouter } from 'next/navigation';
import { findTruckById, getCurrentUser } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck as TruckIcon, Weight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEffect, useMemo, useState } from 'react';
import type { User } from '@/lib/types';

export default function TruckDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const truck = useMemo(() => findTruckById(Number(params.id)), [params.id]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!truck) {
    notFound();
  }

  const handleBooking = () => {
    if (user && !user.isGuest) {
      router.push(`/trucks/confirm?truckId=${truck.id}`);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="bg-muted rounded-lg p-8 flex items-center justify-center mb-8">
            <TruckIcon className="w-32 h-32 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-4xl font-bold font-headline mb-2">{truck.name}</h1>
                <Badge variant="secondary">{truck.size}</Badge>
            </div>
             <div className="text-right">
                <p className="text-3xl font-bold">₹{truck.pricePerDay.toLocaleString()}</p>
                <p className="text-muted-foreground">per day</p>
            </div>
          </div>
           
          <Separator className="my-8" />
          
          <h2 className="text-2xl font-bold font-headline mb-4">Description</h2>
          <p className="text-muted-foreground">{truck.description}</p>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><TruckIcon className="w-4 h-4" /> Size</span>
                  <span className="font-medium">{truck.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Weight className="w-4 h-4" /> Payload</span>
                  <span className="font-medium">{truck.payload}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Star className="w-4 h-4" /> Driver Rating</span>
                  <span className="font-medium">{truck.driverRating}/5</span>
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={handleBooking}>
                Book This Truck
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
