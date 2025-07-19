
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
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cars } from '@/lib/data';
import { CarCard } from './CarCard';
import Link from 'next/link';

const initialState = {
  message: '',
  recommendedCarType: null,
  reasoning: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Get Recommendation
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
  
  const recommendedCar = useMemo(() => {
    if (!state.recommendedCarType) return null;
    const carType = state.recommendedCarType.toLowerCase();
    
    // Find a car that includes the recommended type in its own type string.
    // e.g., AI says "SUV", finds a car of type "SUV".
    return cars.find(car => car.type.toLowerCase().includes(carType)) || null;

  }, [state.recommendedCarType]);


  return (
    <div>
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Tell us about your trip</CardTitle>
            <CardDescription>The more details you provide, the better the recommendation.</CardDescription>
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
                placeholder="e.g., City driving, a trip to the mountains, long highway travel..."
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.recommendedCarType && (
        <Card className="mt-8 bg-primary/5">
          <CardHeader>
            <CardTitle>Our Recommendation: {state.recommendedCarType}</CardTitle>
             <CardDescription>{state.reasoning}</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendedCar ? (
                <div className="max-w-sm mx-auto">
                    <CarCard car={recommendedCar} />
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">We couldn't find a specific vehicle matching the AI recommendation, but you can browse all available cars.</p>
                    <Button asChild>
                        <Link href="/cars">Browse All Cars</Link>
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
