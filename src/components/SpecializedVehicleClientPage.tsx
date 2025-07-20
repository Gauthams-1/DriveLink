
'use client';

import { SpecializedVehicleCard } from "@/components/SpecializedVehicleCard";
import { getAllAvailableSpecializedVehicles } from "@/lib/data";
import { useEffect, useState } from "react";
import type { SpecializedVehicle } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

type SearchParams = {
  'service-type'?: 'wheelchair' | 'pet' | 'senior' | 'visual';
}

export function SpecializedVehicleClientPage({ searchParams }: { searchParams: SearchParams }) {
  const [vehicles, setVehicles] = useState<SpecializedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getAllAvailableSpecializedVehicles().then(data => {
      let filteredVehicles = data;
      const serviceType = searchParams['service-type'];

      if (serviceType) {
        filteredVehicles = data.filter(vehicle => {
          const vehicleType = vehicle.type.toLowerCase();
          if (serviceType === 'wheelchair' && vehicleType.includes('wheelchair')) return true;
          if (serviceType === 'pet' && vehicleType.includes('pet')) return true;
          if (serviceType === 'senior' && vehicleType.includes('senior')) return true;
          if (serviceType === 'visual' && vehicleType.includes('visually impaired')) return true;
          return false;
        });
      }
      setVehicles(filteredVehicles);
      setLoading(false);
    });
  }, [searchParams]);

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
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map(vehicle => (
            <SpecializedVehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
         <div className="text-center col-span-full py-16">
          <h2 className="text-2xl font-semibold mb-2">No vehicles found</h2>
          <p className="text-muted-foreground">Try adjusting your search filters or check back later.</p>
        </div>
      )}
    </>
  );
}
