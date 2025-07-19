
import { RecommendationForm } from '@/components/RecommendationForm';
import { Lightbulb, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="text-center mb-12">
        <Lightbulb className="mx-auto h-12 w-12 text-primary mb-4" />
        <div className="flex justify-center items-center gap-4">
            <h1 className="text-4xl font-bold font-headline">AI Car Recommendation</h1>
            <Badge variant="secondary" className="border-primary/20 text-primary">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
            </Badge>
        </div>
        <p className="text-muted-foreground mt-2 text-lg">
          Describe your perfect trip, and our AI will create the perfect car for you.
        </p>
      </div>

      <RecommendationForm />
    </div>
  );
}
