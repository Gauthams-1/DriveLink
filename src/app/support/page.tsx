
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { findMechanicAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench, Loader2, Star, Phone, MessageSquare, MapPin } from 'lucide-react';
import Image from 'next/image';

const initialState = {
  message: '',
  errors: null,
  mechanic: null,
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

      {!state.mechanic ? (
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
      ) : (
        <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20 animate-in fade-in-50">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Help is on the way!</CardTitle>
                <CardDescription>We've found a mechanic for you. They have been notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row gap-6">
                    <div className="relative">
                        <Image src={state.mechanic.avatarUrl} alt={state.mechanic.name} width={120} height={120} className="rounded-full border-4 border-background ring-4 ring-primary" data-ai-hint="mechanic person" />
                        <div className="absolute -bottom-2 -right-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 flex items-center gap-1 text-sm">
                            <Star className="w-3 h-3 fill-current" /> {state.mechanic.rating}
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-2xl font-bold">{state.mechanic.name}</h3>
                        <p className="text-muted-foreground">{state.mechanic.specialty}</p>
                        <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
                            <MapPin className="w-4 h-4"/>
                            {state.mechanic.location}
                        </p>
                    </div>
                </div>
                <div className="text-center bg-background/50 p-4 rounded-lg">
                    <p className="font-semibold">Reason for selection:</p>
                    <p className="text-muted-foreground text-sm">{state.mechanic.reasoning}</p>
                </div>
            </CardContent>
             <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button className="w-full" size="lg">
                    <Phone className="mr-2 h-5 w-5" /> Call Now ({state.mechanic.phone})
                </Button>
                <Button variant="secondary" className="w-full" size="lg">
                    <MessageSquare className="mr-2 h-5 w-5" /> Chat with Mechanic
                </Button>
            </CardFooter>
        </Card>
      )}

    </div>
  );
}
