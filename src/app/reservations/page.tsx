
'use client';

import { useState, useEffect } from 'react';
import { findCarById, findBusById, findSpecializedVehicleById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { Car, Pencil, Trash2, Bus, Accessibility } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { CarReservationWithDetails, BusReservationWithDetails, Reservation, BusReservation, SpecializedVehicleReservation, SpecializedVehicleReservationWithDetails } from '@/lib/types';

type UnifiedReservation = (CarReservationWithDetails & { type: 'car' }) | (BusReservationWithDetails & { type: 'bus' }) | (SpecializedVehicleReservationWithDetails & { type: 'specialized' });

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<UnifiedReservation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call.
    // We're using localStorage to simulate persistence.
    const storedCarReservations: Reservation[] = JSON.parse(localStorage.getItem('carReservations') || '[]');
    const storedBusReservations: BusReservation[] = JSON.parse(localStorage.getItem('busReservations') || '[]');
    const storedSpecializedReservations: SpecializedVehicleReservation[] = JSON.parse(localStorage.getItem('specializedVehicleReservations') || '[]');

    const carReservationsWithDetails: CarReservationWithDetails[] = storedCarReservations
      .map(r => {
        const car = findCarById(r.carId);
        return car ? { ...r, car, startDate: new Date(r.startDate), endDate: new Date(r.endDate) } : null;
      })
      .filter((r): r is CarReservationWithDetails => r !== null);
    
    const busReservationsWithDetails: BusReservationWithDetails[] = storedBusReservations
      .map(r => {
        const bus = findBusById(r.busId);
        return bus ? { ...r, bus, startDate: new Date(r.startDate), endDate: new Date(r.endDate) } : null;
      })
      .filter((r): r is BusReservationWithDetails => r !== null);

    const specializedReservationsWithDetails: SpecializedVehicleReservationWithDetails[] = storedSpecializedReservations
      .map(r => {
        const vehicle = findSpecializedVehicleById(r.vehicleId);
        return vehicle ? { ...r, vehicle, startDate: new Date(r.startDate), endDate: new Date(r.endDate) } : null;
      })
      .filter((r): r is SpecializedVehicleReservationWithDetails => r !== null);

    const allReservations: UnifiedReservation[] = [
      ...carReservationsWithDetails.map(r => ({ ...r, type: 'car' as const })),
      ...busReservationsWithDetails.map(r => ({ ...r, type: 'bus' as const })),
      ...specializedReservationsWithDetails.map(r => ({ ...r, type: 'specialized' as const })),
    ];
    
    setReservations(allReservations);
  }, []);

  const handleCancelReservation = (reservationId: number, type: 'car' | 'bus' | 'specialized') => {
    let storageKey = '';
    switch (type) {
      case 'car':
        storageKey = 'carReservations';
        break;
      case 'bus':
        storageKey = 'busReservations';
        break;
      case 'specialized':
        storageKey = 'specializedVehicleReservations';
        break;
    }
    
    const storedReservations = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedStoredReservations = storedReservations.filter((r: {id: number}) => r.id !== reservationId);
    localStorage.setItem(storageKey, JSON.stringify(updatedStoredReservations));

    const updatedReservations = reservations.filter(r => !(r.id === reservationId && r.type === type));
    setReservations(updatedReservations);

    toast({
      title: "Reservation Cancelled",
      description: "Your booking has been successfully cancelled.",
    });
  };
  
  const sortedReservations = reservations.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">My Reservations</h1>
        <p className="text-muted-foreground">
          View, modify, or cancel your upcoming trips.
        </p>
      </div>
      
      {sortedReservations.length > 0 ? (
        <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Rental Period</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReservations.map((reservation) => {
              let vehicle, vehicleUrl, aiHint, icon;
              
              if (reservation.type === 'car') {
                vehicle = reservation.car;
                vehicleUrl = `/cars/${vehicle.id}`;
                aiHint = vehicle.type === 'Bike' || vehicle.type === 'Scooter' ? 'motorcycle scooter' : 'car';
                icon = <Car className="h-5 w-5 mr-2 text-muted-foreground" />;
              } else if (reservation.type === 'bus') {
                vehicle = reservation.bus;
                vehicleUrl = `/bus-trips/${vehicle.id}`;
                aiHint = 'bus';
                icon = <Bus className="h-5 w-5 mr-2 text-muted-foreground" />;
              } else { // specialized
                vehicle = reservation.vehicle;
                vehicleUrl = `/specialized/${vehicle.id}`;
                aiHint = 'accessible van';
                icon = <Accessibility className="h-5 w-5 mr-2 text-muted-foreground" />;
              }

              return (
                <TableRow key={`${reservation.type}-${reservation.id}`}>
                  <TableCell>
                    <Link href={vehicleUrl} className="flex items-center gap-4 group">
                      <div className="relative w-24 h-16 rounded-md overflow-hidden">
                        <Image src={vehicle.images[0]} alt={vehicle.name} layout="fill" objectFit="cover" data-ai-hint={aiHint} />
                      </div>
                      <div>
                        <div className="font-medium group-hover:underline flex items-center">{icon} {vehicle.name}</div>
                        <div className="text-sm text-muted-foreground ml-7">{vehicle.type}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {format(new Date(reservation.startDate), 'MMM d, yyyy')} - {format(new Date(reservation.endDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">₹{reservation.totalCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={vehicleUrl}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modify</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Cancel</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently cancel your reservation for the {vehicle.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleCancelReservation(reservation.id, reservation.type)}
                            >
                              Yes, Cancel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <div className="flex justify-center gap-4">
            <Car className="mx-auto h-12 w-12 text-muted-foreground" />
            <Bus className="mx-auto h-12 w-12 text-muted-foreground" />
            <Accessibility className="mx-auto h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No reservations yet</h2>
          <p className="mt-2 text-muted-foreground">Start planning your next trip to see your reservations here.</p>
          <Button asChild className="mt-6">
            <Link href="/">Book a Trip</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
