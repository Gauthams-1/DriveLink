
'use client';

import { useState, useEffect } from 'react';
import { getReservationsForUser, getCurrentUser, cancelReservation } from '@/lib/data';
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
import { Car, Pencil, Trash2, Bus, Accessibility, HeartHandshake, User as UserIcon, Loader2, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import type { ReservationWithVehicle, User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function ReservationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<ReservationWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser && !currentUser.isGuest) {
      getReservationsForUser(currentUser.email)
        .then(setReservations)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleCancelReservation = async (reservation: ReservationWithVehicle) => {
    try {
        await cancelReservation(reservation.id, reservation.vehicleId);
        setReservations(prev => prev.filter(r => r.id !== reservation.id));
        toast({
          title: "Reservation Cancelled",
          description: "Your booking has been successfully cancelled.",
        });
    } catch (error) {
        console.error(error);
        toast({
          title: "Cancellation Failed",
          description: "There was a problem cancelling your reservation.",
          variant: "destructive",
        });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!user || user.isGuest) {
     return (
        <div className="container mx-auto py-16 px-4 text-center">
            <UserIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold font-headline">Access Your Bookings</h1>
            <p className="text-muted-foreground mt-2 text-lg">
                Please log in or create an account to view your reservations.
            </p>
            <Button asChild className="mt-6">
                <Link href="/login">Login or Sign Up</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">My Reservations</h1>
        <p className="text-muted-foreground">
          View, modify, or cancel your upcoming trips.
        </p>
      </div>
      
      {reservations.length > 0 ? (
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
            {reservations.map((reservation) => {
              const { vehicle } = reservation;
              let vehicleUrl, icon;
              
              switch (vehicle.category) {
                  case 'Car':
                  case 'Bike':
                  case 'Scooter':
                      vehicleUrl = `/cars/${vehicle.id}`;
                      icon = <Car className="h-5 w-5 mr-2 text-muted-foreground" />;
                      break;
                  case 'Bus':
                      vehicleUrl = `/bus-trips/${vehicle.id}`;
                      icon = <Bus className="h-5 w-5 mr-2 text-muted-foreground" />;
                      break;
                  case 'Truck':
                      vehicleUrl = `/trucks/${vehicle.id}`;
                      icon = <Truck className="h-5 w-5 mr-2 text-muted-foreground" />;
                      break;
                  case 'Specialized':
                      vehicleUrl = `/specialized/${vehicle.id}`;
                      icon = <Accessibility className="h-5 w-5 mr-2 text-muted-foreground" />;
                      break;
              }
              

              return (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <Link href={vehicleUrl} className="flex items-center gap-4 group">
                      <div>
                        <div className="font-medium group-hover:underline flex items-center">{icon} {vehicle.name}</div>
                        <div className="text-sm text-muted-foreground ml-7">{vehicle.type}</div>
                        {reservation.caretakerAssistance && (
                           <Badge variant="outline" className="mt-1 ml-7 bg-blue-100 text-blue-800 border-blue-200">
                                <HeartHandshake className="h-3 w-3 mr-1" />
                                Caretaker
                           </Badge>
                        )}
                         {reservation.driverAssistance && (
                           <Badge variant="outline" className="mt-1 ml-7 bg-purple-100 text-purple-800 border-purple-200">
                                <UserIcon className="h-3 w-3 mr-1" />
                                Driver
                           </Badge>
                        )}
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
                              onClick={() => handleCancelReservation(reservation)}
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
