
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Briefcase, CheckCircle, Clock, Star, Wrench } from "lucide-react";
import type { User, Job } from "@/lib/types";
import { format } from "date-fns";

export function MechanicDashboard({ user }: { user: User }) {
  const jobs = user.jobs || [];
  const activeJobs = jobs.filter(j => j.status === 'Active');
  const stats = user.partnerStats || { totalRevenue: 0, avgRating: 0 };

  return (
    <div className="space-y-8">
       <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Mechanic Dashboard</h1>
        <p className="text-muted-foreground">Here's an overview of your jobs and earnings.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground font-bold">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs || 0}</div>
            <p className="text-xs text-muted-foreground">Jobs currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs || 0}</div>
            <p className="text-xs text-muted-foreground">Total jobs completed</p>
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
            <CardTitle>Recent Job Requests</CardTitle>
            <CardDescription>A quick look at your most recent job requests.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
            {activeJobs.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {activeJobs.slice(0, 5).map((job) => (
                        <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.customerName}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                            <Badge variant={job.status === 'Active' ? 'destructive' : 'secondary'} className="bg-orange-100 text-orange-800">
                                <Clock className="mr-1 h-3 w-3" />
                                {job.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">{format(new Date(job.date), "dd MMM, yyyy")}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">You have no active jobs. New requests will appear here.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
