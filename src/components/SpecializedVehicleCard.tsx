import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SpecializedVehicle } from '@/lib/types';
import { Users, Star, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface SpecializedVehicleCardProps {
  vehicle: SpecializedVehicle;
}

export function SpecializedVehicleCard({ vehicle }: SpecializedVehicleCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full">
          <Image
            src={vehicle.images[0]}
            alt={`Image of ${vehicle.name}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="accessible van"
          />
          <Badge className="absolute top-2 right-2" variant="secondary">{vehicle.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2 font-headline">{vehicle.name}</CardTitle>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {vehicle.capacity}</div>
          <div className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> {vehicle.driverRating} Rated Driver</div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{vehicle.description}</p>
        <div className="space-y-2">
            {vehicle.features.map(feature => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                </div>
            ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <div>
          <span className="text-2xl font-bold">₹{vehicle.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        <Button asChild>
          <Link href={`/specialized/${vehicle.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
