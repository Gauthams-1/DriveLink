
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
  const serviceType = searchParams['service-type'];
  
  useEffect(() => {
    setLoading(true);
    getAllAvailableSpecializedVehicles().then(data => {
      let filteredVehicles = data;
      
      if (serviceType) {
        // Handle search filter if a service type is provided in the URL
        filteredVehicles = data.filter(vehicle => {
          const vehicleType = vehicle.type.toLowerCase();
          switch (serviceType) {
            case 'wheelchair':
              return vehicleType.includes('wheelchair');
            case 'pet':
              return vehicleType.includes('pet');
            case 'senior':
              return vehicleType.includes('senior');
            case 'visual':
              return vehicleType.includes('visually impaired');
            default:
              return false;
          }
        });
      } else {
        // Default view: show disability-support vehicles by filtering out pet-friendly ones.
        filteredVehicles = data.filter(vehicle => 
            !vehicle.type.toLowerCase().includes('pet')
        ).slice(0, 4);
      }

      setVehicles(filteredVehicles);
      setLoading(false);
    });
  }, [serviceType]);

  if (loading) {
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {vehicles.map(vehicle => (
            <SpecializedVehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
         <div className="text-center col-span-full py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No Vehicles Found</h2>
          <p className="text-muted-foreground">Try adjusting your search filters or check back later.</p>
        </div>
      )}
    </>
  );
}
