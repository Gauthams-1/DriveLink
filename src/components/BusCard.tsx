
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Bus } from '@/lib/types';
import { Users, Star, Wifi, Thermometer, Bus as BusIcon } from 'lucide-react';
import { Button } from './ui/button';

interface BusCardProps {
  bus: Bus;
}

export function BusCard({ bus }: BusCardProps) {
  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wi-fi')) return <Wifi className="w-4 h-4 text-primary" />;
    if (amenity.toLowerCase().includes('air conditioning')) return <Thermometer className="w-4 h-4 text-primary" />;
    return null;
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full bg-muted flex items-center justify-center">
          <BusIcon className="w-24 h-24 text-muted-foreground" />
          <Badge className="absolute top-2 right-2" variant="secondary">{bus.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl mb-2 font-headline">{bus.name}</CardTitle>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {bus.seats} Seats</div>
          <div className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> {bus.driverRating} Rated Driver</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
            {bus.amenities.slice(0, 3).map(amenity => (
                <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                    {getAmenityIcon(amenity)}
                    {amenity}
                </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <div>
          <span className="text-2xl font-bold">₹{bus.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        <Button asChild>
          <Link href={`/bus-trips/${bus.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
