
import { TruckCard } from "@/components/TruckCard";
import { TruckSearchForm } from "@/components/TruckSearchForm";
import { getAllAvailableTrucks } from "@/lib/data";
import { Suspense } from "react";

function TruckList() {
    const availableTrucks = getAllAvailableTrucks();

    return (
        <>
            {availableTrucks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {availableTrucks.map(truck => (
                        <TruckCard key={truck.id} truck={truck} />
                    ))}
                </div>
            ) : (
                <div className="text-center col-span-full py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-semibold mb-2">No Trucks Available</h2>
                    <p className="text-muted-foreground">There are currently no trucks available. Please check back later.</p>
                </div>
            )}
        </>
    );
}

export default function TrucksPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline">Book a Truck</h1>
                <p className="text-muted-foreground mt-2 text-lg">For house shifting, large equipment, and all your heavy-duty needs.</p>
            </div>

            <div className="mb-12">
                <TruckSearchForm />
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
