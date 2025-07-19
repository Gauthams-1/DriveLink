
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getCarRecommendation } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CarCard } from './CarCard';
import { Badge } from './ui/badge';

const initialState = {
  message: '',
  recommendedCar: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Generate My Perfect Car
    </Button>
  );
}

export function RecommendationForm() {
  const [state, formAction] = useActionState(getCarRecommendation, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'success') {
      const errorMessage = typeof state.message === 'string' ? state.message : "An error occurred. Please check your inputs.";
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [state, toast]);


  return (
    <div>
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Tell us about your trip</CardTitle>
            <CardDescription>The more details you provide, the better the car we can create for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numPassengers">Number of Passengers</Label>
                <Input id="numPassengers" name="numPassengers" type="number" min="1" placeholder="e.g., 4" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (INR)</Label>
                <Input id="budget" name="budget" type="number" min="0" placeholder="e.g., 25000" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="luggageAmount">Luggage Amount</Label>
              <Select name="luggageAmount" required>
                <SelectTrigger id="luggageAmount">
                  <SelectValue placeholder="Select luggage size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (a few bags)</SelectItem>
                  <SelectItem value="medium">Medium (standard suitcases)</SelectItem>
                  <SelectItem value="large">Large (lots of gear)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedActivities">Planned Activities</Label>
              <Textarea
                id="plannedActivities"
                name="plannedActivities"
                placeholder="e.g., A family trip to the mountains of Himachal, need something safe and spacious."
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.recommendedCar && (
        <Card className="mt-8 bg-primary/5">
           <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Your AI-Generated Car</CardTitle>
                    <CardDescription>We've created this car just for your trip.</CardDescription>
                </div>
                <Badge variant="secondary" className="border-green-500/20 text-green-700 bg-green-100">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Generated
                </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mx-auto">
                <CarCard car={state.recommendedCar} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
