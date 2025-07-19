import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Truck } from '@/lib/types';
import { Truck as TruckIcon, Weight, Star } from 'lucide-react';
import { Button } from './ui/button';

interface TruckCardProps {
  truck: Truck;
}

export function TruckCard({ truck }: TruckCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full">
          <Image
            src={truck.images[0]}
            alt={`Image of ${truck.name}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="truck"
          />
          <Badge className="absolute top-2 right-2" variant="secondary">{truck.size}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2 font-headline">{truck.name}</CardTitle>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><TruckIcon className="w-4 h-4 text-primary" /> {truck.size}</div>
          <div className="flex items-center gap-2"><Weight className="w-4 h-4 text-primary" /> {truck.payload} Payload</div>
          <div className="flex items-center gap-2 col-span-2"><Star className="w-4 h-4 text-primary" /> {truck.driverRating} Rated Driver</div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">{truck.description}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <div>
          <span className="text-2xl font-bold">₹{truck.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        <Button asChild>
          <Link href={`/trucks/${truck.id}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
