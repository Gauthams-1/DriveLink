import { SpecializedVehicleCard } from "@/components/SpecializedVehicleCard";
import { specializedVehicles } from "@/lib/data";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Accessibility, PawPrint, PersonStanding, EyeOff } from "lucide-react";
import type { SpecializedVehicle } from "@/lib/types";

type SearchParams = {
  'service-type'?: 'wheelchair' | 'pet' | 'senior' | 'visual';
}

function SpecializedVehicleList({ searchParams }: { searchParams: SearchParams }) {
  let filteredVehicles: SpecializedVehicle[] = specializedVehicles;

  const serviceType = searchParams['service-type'];

  if (serviceType) {
    filteredVehicles = specializedVehicles.filter(vehicle => {
      const vehicleType = vehicle.type.toLowerCase();
      if (serviceType === 'wheelchair' && vehicleType.includes('wheelchair')) return true;
      if (serviceType === 'pet' && vehicleType.includes('pet')) return true;
      if (serviceType === 'senior' && vehicleType.includes('senior')) return true;
      if (serviceType === 'visual' && vehicleType.includes('visually impaired')) return true;
      return false;
    });
  }

  return (
    <>
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map(vehicle => (
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

export default function SpecializedVehiclesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <div className="flex justify-center gap-4 mb-4">
            <Accessibility className="h-10 w-10 text-primary" />
            <PawPrint className="h-10 w-10 text-primary" />
            <PersonStanding className="h-10 w-10 text-primary" />
            <EyeOff className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">Specialized Vehicle Services</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Safe and comfortable travel for everyone. We cater to your special needs.
        </p>
      </div>

      <Card className="mb-12 shadow-lg">
        <CardContent className="p-4 md:p-6">
           <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="service-type">What service are you looking for?</Label>
                <Select name="service-type" defaultValue={searchParams['service-type']}>
                  <SelectTrigger id="service-type">
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheelchair">Wheelchair Accessible</SelectItem>
                    <SelectItem value="pet">Pet Friendly</SelectItem>
                    <SelectItem value="senior">Senior Citizen Support</SelectItem>
                    <SelectItem value="visual">Visually Impaired Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button type="submit" className="w-full">Search</Button>
              </div>
           </form>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-3xl font-bold font-headline">Available Vehicles</h2>
        <p className="text-muted-foreground">
          {searchParams['service-type'] ? `Showing results for ${searchParams['service-type']} friendly vehicles` : 'Choose from our fleet of specially equipped vehicles.'}
        </p>
      </div>
      
      <Suspense fallback={<div>Loading vehicles...</div>}>
        <SpecializedVehicleList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
