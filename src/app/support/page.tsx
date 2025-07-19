'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { findMechanicAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench, Loader2 } from 'lucide-react';

const initialState = {
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Finding Help...
        </>
      ) : (
        <>
         <Wrench className="mr-2 h-5 w-5" />
          Find Mechanic
        </>
      )}
    </Button>
  );
}

export default function SupportPage() {
  const [state, formAction] = useActionState(findMechanicAction, initialState);
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <Wrench className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Breakdown Support</h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          In a bind? Enter your vehicle's issue and we'll connect you with a nearby partner mechanic instantly.
        </p>
      </div>

        <Card className="max-w-2xl mx-auto">
          <form action={formAction}>
            <CardHeader>
              <CardTitle>Request Assistance</CardTitle>
              <CardDescription>Fill out the details below to get help.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location">Your Current Location</Label>
                <Input 
                  id="location" 
                  name="location"
                  placeholder="e.g., Andheri, Mumbai" 
                  required 
                />
                {state.errors?.location && <p className="text-sm text-destructive mt-1">{state.errors.location[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="problemDescription">Describe the Problem</Label>
                <Textarea
                  id="problemDescription"
                  name="problemDescription"
                  placeholder="e.g., My car won't start, I hear a rattling noise from the engine..."
                  required
                  rows={4}
                />
                 {state.errors?.problemDescription && <p className="text-sm text-destructive mt-1">{state.errors.problemDescription[0]}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
    </div>
  );
}
