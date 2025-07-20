
'use client';

import { CarCard } from "@/components/CarCard";
import { getAllAvailableCars } from "@/lib/data";
import type { Car } from "@/lib/types";
import { useEffect, useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCars(getAllAvailableCars());
    setLoading(false);
  }, []);

  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[224px] w-full rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
  }

  return (
    <>
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center col-span-full py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No Cars Found</h2>
          <p className="text-muted-foreground">No partner vehicles are available at this time. Please check back later.</p>
        </div>
      )}
    </>
  );
}

function CarsPageContent() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Rent a Car, Bike, or Scooter</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your perfect ride is just a click away. Find the best deals on wheels.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold font-headline">Available Vehicles</h2>
                <p className="text-muted-foreground">
                 Browse our full selection of available rentals.
                </p>
            </div>
          <CarList />
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CarsPageContent />
        </Suspense>
    )
}
