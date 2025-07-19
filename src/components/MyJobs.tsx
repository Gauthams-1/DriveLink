
'use client';

import { useState } from 'react';
import type { User, Job } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, CheckCircle, Clock, MapPin, User as UserIcon, Wrench } from 'lucide-react';
import { format } from 'date-fns';

function JobCard({ job }: { job: Job }) {
  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2"><UserIcon className="w-4 h-4"/>{job.customerName}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1"><MapPin className="w-4 h-4"/>{job.location}</CardDescription>
          </div>
          <Badge className={getStatusBadge(job.status)}>{job.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{job.problemDescription}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground bg-muted/50 p-3">
        <span>Job ID: #{job.id}</span>
        <span>{format(new Date(job.date), "dd MMM, yyyy - h:mm a")}</span>
      </CardFooter>
    </Card>
  );
}

export function MyJobs({ user }: { user: User }) {
  const allJobs = user.jobs || [];
  const activeJobs = allJobs.filter(job => job.status === 'Active');
  const previousJobs = allJobs.filter(job => job.status !== 'Active');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Jobs</h1>
          <p className="text-muted-foreground">An overview of all your service requests.</p>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            <Clock className="mr-2 h-4 w-4" />
            Active Jobs ({activeJobs.length})
          </TabsTrigger>
          <TabsTrigger value="previous">
            <CheckCircle className="mr-2 h-4 w-4" />
            Previous Jobs ({previousJobs.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          {activeJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {activeJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 border-2 border-dashed">
                <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold font-headline">No Active Jobs</h2>
                <p className="text-muted-foreground mt-2">New requests from customers will appear here.</p>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="previous" className="mt-6">
           {previousJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {previousJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
             <Card className="text-center py-16 border-2 border-dashed">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold font-headline">No Previous Jobs</h2>
                <p className="text-muted-foreground mt-2">Completed or cancelled jobs will be listed here.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
