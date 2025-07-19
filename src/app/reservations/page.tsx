
'use client';

import { useState, useMemo } from 'react';
import { findCarReservations, findBusReservations } from '@/lib/data';
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
import { Car, Pencil, Trash2, Bus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { CarReservationWithDetails, BusReservationWithDetails } from '@/lib/types';

type UnifiedReservation = (CarReservationWithDetails & { type: 'car' }) | (BusReservationWithDetails & { type: 'bus' });

export default function ReservationsPage() {
  const initialCarReservations = useMemo(() => findCarReservations().map(r => ({ ...r, type: 'car' as const })), []);
  const initialBusReservations = useMemo(() => findBusReservations().map(r => ({ ...r, type: 'bus' as const })), []);

  const [reservations, setReservations] = useState<UnifiedReservation[]>([...initialCarReservations, ...initialBusReservations]);
  const { toast } = useToast();

  const handleCancelReservation = (reservationId: number, type: 'car' | 'bus') => {
    // In a real app, you would make an API call here to delete the reservation.
    // For this demo, we'll just filter it out from the local state.
    const updatedReservations = reservations.filter(r => !(r.id === reservationId && r.type === type));
    setReservations(updatedReservations);

    toast({
      title: "Reservation Cancelled",
      description: "Your booking has been successfully cancelled.",
    });
  };
  
  const sortedReservations = reservations.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

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
              const isCar = reservation.type === 'car';
              const vehicle = isCar ? reservation.car : reservation.bus;
              const vehicleUrl = isCar ? `/cars/${vehicle.id}` : `/bus-trips/${vehicle.id}`;

              return (
                <TableRow key={`${reservation.type}-${reservation.id}`}>
                  <TableCell>
                    <Link href={vehicleUrl} className="flex items-center gap-4 group">
                      <div className="relative w-24 h-16 rounded-md overflow-hidden">
                        <Image src={vehicle.images[0]} alt={vehicle.name} layout="fill" objectFit="cover" data-ai-hint={isCar ? "car" : "bus"} />
                      </div>
                      <div>
                        <div className="font-medium group-hover:underline">{vehicle.name}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.type}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {format(reservation.startDate, 'MMM d, yyyy')} - {format(reservation.endDate, 'MMM d, yyyy')}
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
