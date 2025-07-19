
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { DollarSign, Star, TrendingUp, Car } from "lucide-react";
import type { User, Trip } from "@/lib/types";
import { format } from "date-fns";

export function DriverDashboard({ user }: { user: User }) {
  const trips = user.trips || [];
  const stats = user.partnerStats || { totalRevenue: 0, avgRating: 0, totalTrips: 0 };

  return (
    <div className="space-y-8">
       <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Driver Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name.split(' ')[0]}! Here's an overview of your trips and earnings.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrips || 0}</div>
            <p className="text-xs text-muted-foreground">Completed trips</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating > 0 ? stats.avgRating : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">{stats.avgRating > 0 ? 'Based on customer reviews' : 'No reviews yet'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent Trips</CardTitle>
            <CardDescription>A quick look at your most recent completed trips.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            {trips.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Payout</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {trips.slice(0, 5).map((trip) => (
                        <TableRow key={trip.id}>
                            <TableCell className="font-medium">{trip.customerName}</TableCell>
                            <TableCell>{trip.route}</TableCell>
                            <TableCell>
                               <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground"/>
                                <span>{trip.vehicle}</span>
                               </div>
                            </TableCell>
                            <TableCell>{format(new Date(trip.date), "dd MMM, yyyy")}</TableCell>
                            <TableCell className="text-right font-semibold text-green-600">₹{trip.payout.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">You have no completed trips yet. New jobs will appear here once completed.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
