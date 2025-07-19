import { BusCard } from "@/components/BusCard";
import { buses } from "@/lib/data";
import { Suspense } from "react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";


function BusList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {buses.map(bus => (
        <BusCard key={bus.id} bus={bus} />
      ))}
    </div>
  );
}

export default function BusTripsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Book Your Group Trip</h1>
        <p className="text-muted-foreground mt-2 text-lg">Find the perfect bus for your next adventure.</p>
      </div>

      <Card className="mb-12 shadow-lg">
        <CardContent className="p-4 md:p-6">
           <form className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4 items-end">
              <div className="lg:col-span-3 space-y-2">
                <Label htmlFor="destination">Destination</Label>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="destination" placeholder="e.g., Las Vegas" className="pl-10" />
                 </div>
              </div>
              <div className="lg:col-span-3 space-y-2">
                <Label>Travel Dates</Label>
                <DatePickerWithRange />
              </div>
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="passengers">Passengers</Label>
                 <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="passengers" type="number" placeholder="e.g., 30" className="pl-10" />
                 </div>
              </div>
              <div className="lg:col-span-2">
                <Button type="submit" className="w-full">Search Buses</Button>
              </div>
           </form>
        </CardContent>
      </Card>


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
