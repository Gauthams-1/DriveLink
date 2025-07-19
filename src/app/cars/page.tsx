
import { CarCard } from "@/components/CarCard";
import { cars } from "@/lib/data";
import { Car } from "@/lib/types";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

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
            <h2 className="text-2xl font-bold mb-4">Pickup Locations</h2>
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
                <Image src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=600&auto=format&fit=crop" alt="Map of pickup locations" layout="fill" objectFit="cover" data-ai-hint="city map" />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="w-8 h-8 text-primary animate-pulse" />
                </div>
                 <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="w-6 h-6 text-primary" />
                </div>
                 <div className="absolute bottom-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2">
                    <MapPin className="w-6 h-6 text-primary" />
                </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Interactive map coming soon.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
