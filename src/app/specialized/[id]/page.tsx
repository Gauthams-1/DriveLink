
'use client';

import { notFound, useRouter } from 'next/navigation';
import { findVehicleById, getCurrentUser } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Star, Accessibility, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { User, SpecializedVehicle } from '@/lib/types';


export default function SpecializedVehicleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<SpecializedVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    if (params.id) {
        findVehicleById(params.id)
            .then(v => {
                if (v && v.category === 'Specialized') {
                    setVehicle(v as SpecializedVehicle);
                }
                setLoading(false);
            })
    }
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin"/></div>;
  }

  if (!vehicle) {
    notFound();
  }

  const handleBooking = () => {
    if (user && !user.isGuest) {
      router.push(`/specialized/confirm?vehicleId=${vehicle.id}`);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
           <div className="bg-muted rounded-lg p-8 flex items-center justify-center mb-8">
            <Accessibility className="w-32 h-32 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-bold font-headline mb-2">{vehicle.name}</h1>
                <Badge variant="secondary">{vehicle.type}</Badge>
            </div>
             <div className="text-right">
                <p className="text-3xl font-bold">₹{vehicle.pricePerDay.toLocaleString()}</p>
                <p className="text-muted-foreground">per day</p>
            </div>
          </div>
           <p className="text-lg text-muted-foreground mt-4">{vehicle.description}</p>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Capacity</span>
                  <span className="font-medium">{vehicle.capacity}</span>
                </div>
                 <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Star className="w-4 h-4" /> Driver Rating</span>
                  <span className="font-medium">{vehicle.driverRating}/5</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-2">
                    {vehicle.features.map(feature => (
                    <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        <span>{feature}</span>
                    </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={handleBooking}>
                Book Now
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}
