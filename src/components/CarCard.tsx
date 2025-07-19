
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Car as CarType } from '@/lib/types';
import { Users, Briefcase, Gauge, GitBranch, Zap, Fuel, PersonStanding, Car as CarIcon } from 'lucide-react';
import { Button } from './ui/button';

interface CarCardProps {
  car: CarType;
}

export function CarCard({ car }: CarCardProps) {
  const isTwoWheeler = car.type === 'Bike' || car.type === 'Scooter';

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
        <Link href={`/cars/${car.id}`} className="flex flex-col h-full">
            <CardHeader className="p-0">
            <div className="relative h-56 w-full bg-muted flex items-center justify-center">
                <CarIcon className="w-24 h-24 text-muted-foreground" />
                <Badge className="absolute top-2 right-2" variant="secondary">{car.type}</Badge>
            </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
            <CardTitle className="text-xl mb-2 font-headline">{car.name}</CardTitle>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {isTwoWheeler ? <PersonStanding className="w-4 h-4 text-primary" /> : <Users className="w-4 h-4 text-primary" />} 
                  {car.seats} {isTwoWheeler ? 'Rider' : 'Seats'}{car.seats > 1 && !isTwoWheeler ? 's' : ''}
                </div>
                
                {isTwoWheeler ? (
                  <div className="flex items-center gap-2">
                    {car.mpg > 100 ? <Zap className="w-4 h-4 text-primary" /> : <Fuel className="w-4 h-4 text-primary" />} 
                    {car.mpg > 100 ? `${car.mpg} km charge` : `${car.mpg} KMPL`}
                  </div>
                ) : (
                  <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> {car.luggage} Bags</div>
                )}
                
                <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-primary" /> {car.transmission}</div>

                {!isTwoWheeler && (
                  <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-primary" /> {car.mpg} KMPL</div>
                )}
            </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center bg-muted/50 mt-auto">
            <div>
                <span className="text-2xl font-bold">₹{car.pricePerDay}</span>
                <span className="text-sm text-muted-foreground">/day</span>
            </div>
            <Button variant="outline" asChild>
                <span>View Details</span>
            </Button>
            </CardFooter>
        </Link>
    </Card>
  );
}
