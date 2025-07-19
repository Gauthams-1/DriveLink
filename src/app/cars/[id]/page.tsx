
'use client';

import { notFound } from 'next/navigation';
import { findCarById } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CheckCircle, Gauge, GitBranch, MapPin, Users } from 'lucide-react';
import { CostCalculator } from '@/components/CostCalculator';
import { Separator } from '@/components/ui/separator';

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const car = findCarById(Number(params.id));

  if (!car) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
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
                  <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Seats</span>
                  <span className="font-medium">{car.seats}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> Luggage</span>
                  <span className="font-medium">{car.luggage} bags</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><GitBranch className="w-4 h-4" /> Transmission</span>
                  <span className="font-medium">{car.transmission}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-2"><Gauge className="w-4 h-4" /> MPG</span>
                  <span className="font-medium">{car.mpg}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="outline">{car.type}</Badge>
                </div>
              </CardContent>
            </Card>

            <CostCalculator car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}
