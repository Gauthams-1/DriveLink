
import { CarCard } from "@/components/CarCard";
import { cars } from "@/lib/data";
import { Car } from "@/lib/types";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SearchParams = {
  location?: string;
  pickup?: string;
  dropoff?: string;
  type?: 'Sedan' | 'SUV' | 'Minivan' | 'Convertible' | 'Coupe';
};

function CarList({ searchParams }: { searchParams: SearchParams }) {
  let filteredCars = cars;

  if (searchParams.location) {
    filteredCars = filteredCars.filter(car => car.location.toLowerCase().includes(searchParams.location!.toLowerCase()));
  }

  if (searchParams.type) {
    filteredCars = filteredCars.filter(car => car.type === searchParams.type);
  }

  return (
    <>
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center col-span-full py-16">
          <h2 className="text-2xl font-semibold mb-2">No cars found</h2>
          <p className="text-muted-foreground">Try adjusting your search filters or check back later.</p>
        </div>
      )}
    </>
  );
}


export default function CarsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Available Cars</h1>
        <p className="text-muted-foreground">
          Showing results for {searchParams.location || 'all locations'}
          {searchParams.pickup && searchParams.dropoff && ` from ${searchParams.pickup} to ${searchParams.dropoff}`}.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Suspense fallback={<div>Loading cars...</div>}>
            <CarList searchParams={searchParams} />
          </Suspense>
        </div>
        <aside className="lg:w-1/3">
          <div className="sticky top-24">
            <Card>
                <CardHeader>
                    <CardTitle>Pickup Locations</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">We have pickup locations across all major cities. Enter your route to find the nearest one.</p>
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/locations">View All Locations</Link>
                        </Button>
                         <Button asChild>
                            <Link href="/recommendations">Get AI Recommendation</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
