
'use client';

import { CarCard } from "@/components/CarCard";
import { getAllAvailableCars, findCarReservations } from "@/lib/data";
import type { Car, CarReservationWithDetails } from "@/lib/types";
import { useEffect, useState, Suspense } from "react";
import { CarSearchForm } from "@/components/CarSearchForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { parseISO, startOfDay } from "date-fns";

function CarList() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location');
  const type = searchParams.get('type');
  const pickupDateStr = searchParams.get('pickup');
  const dropoffDateStr = searchParams.get('dropoff');
  
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allCars = getAllAvailableCars();
    let filteredCars: Car[] = allCars;

    if (location) {
      filteredCars = filteredCars.filter(car => car.location?.toLowerCase().includes(location.toLowerCase()));
    }

    if (type && type !== 'all') {
      filteredCars = filteredCars.filter(car => car.type === type);
    }
    
    if (pickupDateStr && dropoffDateStr) {
      const searchFrom = startOfDay(parseISO(pickupDateStr));
      const searchTo = startOfDay(parseISO(dropoffDateStr));
      const allReservations = findCarReservations();
      
      const isOverlapping = (reservationStart: Date, reservationEnd: Date, searchStart: Date, searchEnd: Date) => {
        const resStart = startOfDay(reservationStart);
        const resEnd = startOfDay(reservationEnd);
        return resStart < searchEnd && resEnd > searchStart;
      }
      
      filteredCars = filteredCars.filter(car => {
          const carReservations = allReservations.filter(r => r.carId === car.id);
          if (carReservations.length === 0) {
              return true; 
          }

          const isBookedDuringSearch = carReservations.some(reservation => 
              isOverlapping(new Date(reservation.startDate), new Date(reservation.endDate), searchFrom, searchTo)
          );
          
          return !isBookedDuringSearch;
      });
    }

    setCars(filteredCars);
    setLoading(false);
  }, [location, type, pickupDateStr, dropoffDateStr]);

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
          <p className="text-muted-foreground">No partner vehicles are available for this search. Try different dates or filters.</p>
        </div>
      )}
    </>
  );
}

function CarsPageContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location');
  const type = searchParams.get('type');

  const displayLocation = type && type !== 'all' ? `${type}s` : 'All Vehicles';
  
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
                 Showing results for {displayLocation} {location ? `in ${location}` : ''}
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
