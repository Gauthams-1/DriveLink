
import { CarCard } from "@/components/CarCard";
import { getAllAvailableCars } from "@/lib/data";
import { Car } from "@/lib/types";
import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarSearchForm } from "@/components/CarSearchForm";

type SearchParams = {
  location?: string;
  pickup?: string;
  dropoff?: string;
  type?: 'Sedan' | 'SUV' | 'Minivan' | 'Convertible' | 'Coupe' | 'Bike' | 'Scooter';
};

function CarList({ searchParams }: { searchParams: SearchParams }) {
  const allCars = getAllAvailableCars();
  let filteredCars: Car[] = allCars;

  if (searchParams.location) {
    filteredCars = filteredCars.filter(car => car.location?.toLowerCase().includes(searchParams.location!.toLowerCase()));
  }

  if (searchParams.type && searchParams.type !== 'all') {
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
        <div className="text-center col-span-full py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No Cars Found</h2>
          <p className="text-muted-foreground">No partner vehicles are available for this search. Try different filters or check back later.</p>
        </div>
      )}
    </>
  );
}

export default function CarsPage({ searchParams }: { searchParams: SearchParams }) {
  const displayLocation = searchParams.type ? `${searchParams.type}s` : 'All Vehicles';
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Rent a Car, Bike, or Scooter</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your perfect ride is just a search away. Find the best deals on wheels.</p>
      </div>

       <div className="mb-12">
        <CarSearchForm />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold font-headline">Available Vehicles</h2>
                <p className="text-muted-foreground">
                Showing results for {displayLocation} {searchParams.location ? `in ${searchParams.location}` : ''}
                </p>
            </div>
          <Suspense fallback={<div>Loading cars...</div>}>
            <CarList searchParams={searchParams} />
          </Suspense>
        </div>
        <aside className="lg:w-1/3 hidden">
          <div className="sticky top-24">
            <Card>
                <CardHeader>
                    <CardTitle>Can't decide?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Let our AI find the perfect car for your trip based on your needs.</p>
                     <Button asChild className="w-full">
                        <Link href="/recommendations">Get AI Recommendation</Link>
                    </Button>
                </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
