
import { partnerStats } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Car, Star } from "lucide-react";
import type { User } from "@/lib/types";

export function PartnerDashboard({ user }: { user: User }) {
  const fleet = user.vehicles || [];
  const activeBookings = fleet.filter(v => v.status === 'Rented').length;

  return (
    <div className="space-y-8">
       <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Partner Dashboard</h1>
        <p className="text-muted-foreground">Here's an overview of your fleet and earnings.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground font-bold">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{partnerStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBookings}</div>
            <p className="text-xs text-muted-foreground">{activeBookings} currently on rent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Fleet</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleet.length}</div>
            <p className="text-xs text-muted-foreground">Vehicles listed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partnerStats.avgRating}</div>
            <p className="text-xs text-muted-foreground">Based on 25 reviews</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Your Fleet Overview</CardTitle>
            <CardDescription>A quick look at your vehicles and their status.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            {fleet.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Price/Day</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {fleet.slice(0, 5).map((vehicle) => (
                        <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.name}</TableCell>
                        <TableCell>{vehicle.type}</TableCell>
                        <TableCell>
                            <Badge variant={vehicle.status === 'Available' ? 'secondary' : 'default'} className={vehicle.status === 'Rented' ? 'bg-orange-500' : 'bg-green-500'}>
                            {vehicle.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{vehicle.pricePerDay}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Your fleet is empty. Add a vehicle in the 'My Fleet' tab to get started.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
