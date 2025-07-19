import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Car as CarType } from '@/lib/types';
import { Users, Briefcase, Gauge, GitBranch } from 'lucide-react';
import { Button } from './ui/button';

interface CarCardProps {
  car: CarType;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-56 w-full">
            <Image
              src={car.images[0]}
              alt={`Image of ${car.name}`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="car"
            />
            <Badge className="absolute top-2 right-2" variant="secondary">{car.type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-xl mb-2 font-headline">{car.name}</CardTitle>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {car.seats} Seats</div>
            <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> {car.luggage} Bags</div>
            <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-primary" /> {car.transmission}</div>
            <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-primary" /> {car.mpg} MPG</div>
          </div>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
          <div>
            <span className="text-2xl font-bold">${car.pricePerDay}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
          <Button asChild>
            <span className="group-hover:bg-accent group-hover:text-accent-foreground">View Details</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
