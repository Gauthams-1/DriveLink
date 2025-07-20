
'use client';

import { notFound, useRouter } from 'next/navigation';
import { findVehicleById, getCurrentUser } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Star, Wifi, Thermometer, Tv, Sofa, Bus as BusIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { User, Bus } from '@/lib/types';

const amenityIcons: { [key: string]: React.ReactNode } = {
  'air conditioning': <Thermometer className="w-5 h-5 text-accent" />,
  'wi-fi': <Wifi className="w-5 h-5 text-accent" />,
  'personal tv': <Tv className="w-5 h-5 text-accent" />,
  'blankets': <Sofa className="w-5 h-5 text-accent" />,
  'reading lights': <CheckCircle className="w-5 h-5 text-accent" />,
  'restroom': <CheckCircle className="w-5 h-5 text-accent" />,
  'snack bar': <CheckCircle className="w-5 h-5 text-accent" />,
};

export default function BusDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    if (params.id) {
      findVehicleById(params.id)
        .then(vehicle => {
          if (vehicle && vehicle.category === 'Bus') {
            setBus(vehicle as Bus);
          }
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin"/></div>;
  }

  if (!bus) {
    notFound();
  }
  
  const handleBooking = () => {
    if (user && !user.isGuest) {
      router.push(`/bus-trips/confirm?busId=${bus.id}`);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="bg-muted rounded-lg p-8 flex items-center justify-center mb-8">
            <BusIcon className="w-32 h-32 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-bold font-headline mb-2">{bus.name}</h1>
                <Badge variant="secondary">{bus.type}</Badge>
            </div>
             <div className="text-right">
                <p className="text-3xl font-bold">₹{bus.pricePerDay.toLocaleString()}</p>
                <p className="text-muted-foreground">per day</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Bus Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Capacity</span>
                  <span className="font-medium">{bus.seats} Seats</span>
                </div>
                 <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Star className="w-4 h-4" /> Driver Rating</span>
                  <span className="font-medium">{bus.driverRating}/5</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="grid grid-cols-2 gap-4">
                    {bus.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2">
                        {amenityIcons[amenity.toLowerCase()] || <CheckCircle className="w-5 h-5 text-accent" />}
                        <span>{amenity}</span>
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
