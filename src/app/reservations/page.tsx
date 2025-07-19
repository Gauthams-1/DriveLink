import { findReservations } from '@/lib/data';
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
import { Car, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ReservationsPage() {
  const reservations = findReservations();

  return (
    <div className="container mx-auto py-8 px-4">
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
              <TableHead>Car</TableHead>
              <TableHead>Rental Period</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-16 rounded-md overflow-hidden">
                      <Image src={reservation.car.images[0]} alt={reservation.car.name} layout="fill" objectFit="cover" data-ai-hint="car" />
                    </div>
                    <div>
                      <div className="font-medium">{reservation.car.name}</div>
                      <div className="text-sm text-muted-foreground">{reservation.car.type}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {format(reservation.startDate, 'MMM d, yyyy')} - {format(reservation.endDate, 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">₹{reservation.totalCost.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modify</span>
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
                            This action cannot be undone. This will permanently cancel your reservation for the {reservation.car.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Car className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No reservations yet</h2>
          <p className="mt-2 text-muted-foreground">Start planning your next trip to see your reservations here.</p>
          <Button className="mt-6">Find a Car</Button>
        </div>
      )}
    </div>
  );
}
