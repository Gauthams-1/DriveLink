
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { findSpecializedVehicleById } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SpecializedVehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = findSpecializedVehicleById(Number(params.id));

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Carousel className="w-full mb-8 rounded-lg overflow-hidden shadow-lg">
            <CarouselContent>
              {vehicle.images.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px]">
                    <Image src={src} alt={`${vehicle.name} view ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="accessible van" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-16" />
            <CarouselNext className="mr-16" />
          </Carousel>
          
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
                  <span className="font-medium">{vehicle.driver.rating}/5</span>
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
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                    </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" asChild>
                <Link href={`/specialized/confirm?vehicleId=${vehicle.id}`}>Book Now</Link>
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}
