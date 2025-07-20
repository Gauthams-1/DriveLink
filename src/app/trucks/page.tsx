
'use client';

import { TruckCard } from "@/components/TruckCard";
import { getAllAvailableTrucks } from "@/lib/data";
import type { Truck } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useEffect, useState } from "react";

function TruckList() {
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllAvailableTrucks()
            .then(setTrucks)
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
            {trucks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trucks.map(truck => (
                        <TruckCard key={truck.id} truck={truck} />
                    ))}
                </div>
            ) : (
                <div className="text-center col-span-full py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-semibold mb-2">No Trucks Available</h2>
                    <p className="text-muted-foreground">There are currently no trucks available from our partners. Please check back later.</p>
                </div>
            )}
        </>
    );
}

export default function TrucksPage() {
    return (
        <div className="container mx-auto py-8 px-4 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline">Book a Truck</h1>
                <p className="text-muted-foreground mt-2 text-lg">For house shifting, large equipment, and all your heavy-duty needs.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-3xl font-bold font-headline">Available Trucks</h2>
                <p className="text-muted-foreground">Choose the right truck for your job.</p>
            </div>

            <Suspense fallback={<div>Loading trucks...</div>}>
                <TruckList />
            </Suspense>
        </div>
    );
}
