import { user, findReservations } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import Image from "next/image";
import { Separator } from "./ui/separator";

export function CustomerProfile() {
  const reservations = findReservations();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-1">Member since {format(user.memberSince, 'MMMM yyyy')}</p>
              <Button variant="outline" size="sm" className="mt-4">Edit Profile</Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your past and upcoming reservations.</CardDescription>
        </CardHeader>
        <CardContent>
           {reservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Car</TableHead>
                  <TableHead>Rental Period</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
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
                    <TableCell className="text-right">${reservation.totalCost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           ) : (
            <p className="text-muted-foreground">You have no recent bookings.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
