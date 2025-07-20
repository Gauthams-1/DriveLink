
'use client';

import { BusCard } from "@/components/BusCard";
import { getAllAvailableBuses } from "@/lib/data";
import { Suspense, useEffect, useState } from "react";
import type { Bus } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function BusList() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAvailableBuses()
      .then(setBuses)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
      {buses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buses.map(bus => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </div>
      ) : (
        <div className="text-center col-span-full py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No Buses Available</h2>
          <p className="text-muted-foreground">There are currently no buses available from our partners. Please check back later.</p>
        </div>
      )}
    </>
  );
}

export default function BusTripsPage() {
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Book Your Group Trip</h1>
        <p className="text-muted-foreground mt-2 text-lg">Find the perfect bus for your next adventure.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold font-headline">Available Buses</h2>
        <p className="text-muted-foreground">Choose from our fleet of modern and comfortable buses.</p>
      </div>
      
      <Suspense fallback={<div>Loading buses...</div>}>
        <BusList />
      </Suspense>
    </div>
  );
}
