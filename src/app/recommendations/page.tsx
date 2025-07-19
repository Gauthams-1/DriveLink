import { RecommendationForm } from '@/components/RecommendationForm';
import { Lightbulb } from 'lucide-react';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="text-center mb-12">
        <Lightbulb className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline">AI Car Recommendation</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Let our smart assistant find the perfect car for your trip.
        </p>
      </div>

      <RecommendationForm />
    </div>
  );
}
