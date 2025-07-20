
'use client';

import { notFound } from 'next/navigation';
import { findVehicleById } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, CheckCircle, Gauge, GitBranch, MapPin, Users, PersonStanding, Loader2, DollarSign, Route } from 'lucide-react';
import { CostCalculator } from '@/components/CostCalculator';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import type { Car } from '@/lib/types';

function PricingDetailsCard({ car }: { car: Car }) {
    if (!car.pricing) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pricing Details</CardTitle>
                <CardDescription>This vehicle's rental rates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {car.pricing.method === 'perDay' ? (
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" /> Rate</span>
                        <span className="font-medium">₹{car.pricing.perDayRate?.toLocaleString()}/day</span>
                    </div>
                ) : (
                     <div className='space-y-2'>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" /> Fixed Rate</span>
                            <span className="font-medium">₹{car.pricing.fixedKmPackage?.rate.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-2 pl-6">Included Kilometers</span>
                            <span className="font-medium">{car.pricing.fixedKmPackage?.km} km</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-2 pl-6">Extra</span>
                            <span className="font-medium">₹{car.pricing.perKmCharge}/km</span>
                        </div>
                     </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function CarDetailPage({ params: { id } }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      findVehicleById(id)
        .then(vehicle => {
          if (vehicle && (vehicle.category === 'Car' || vehicle.category === 'Bike' || vehicle.category === 'Scooter')) {
            setCar(vehicle as Car);
          }
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin"/></div>;
  }

  if (!car) {
    notFound();
  }

  const isTwoWheeler = car.type === 'Bike' || car.type === 'Scooter';

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold font-headline mb-2">{car.name}</h1>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">{car.location}</span>
          </div>
          
          <Separator className="my-8" />
          
          <h2 className="text-2xl font-bold font-headline mb-4">Description</h2>
          <p className="text-muted-foreground mb-8">{car.description}</p>
          
          <h2 className="text-2xl font-bold font-headline mb-4">Key Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {car.features.map(feature => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2">
                    {isTwoWheeler ? <PersonStanding className="w-4 h-4" /> : <Users className="w-4 h-4" />} 
                    {isTwoWheeler ? 'Riders' : 'Seats'}
                  </span>
                  <span className="font-medium">{car.seats}</span>
                </div>
                 {!isTwoWheeler && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> Luggage</span>
                    <span className="font-medium">{car.luggage} bags</span>
                  </div>
                 )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><GitBranch className="w-4 h-4" /> Transmission</span>
                  <span className="font-medium">{car.transmission}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Gauge className="w-4 h-4" /> Efficiency</span>
                  <span className="font-medium">{car.mpg} {car.type === 'Scooter' || car.type === 'Bike' && car.mpg > 100 ? 'km/charge' : 'kmpl'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="outline">{car.type}</Badge>
                </div>
              </CardContent>
            </Card>

            <PricingDetailsCard car={car} />

            <CostCalculator vehicle={car} />
          </div>
        </div>
      </div>
    </div>
  );
}
