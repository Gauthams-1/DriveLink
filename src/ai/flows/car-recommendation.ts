'use server';

/**
 * @fileOverview AI-powered car recommendation flow.
 *
 * This file defines a Genkit flow that suggests suitable cars based on user preferences.
 * - recommendCars - A function that recommends cars based on user preferences.
 * - CarRecommendationInput - The input type for the recommendCars function.
 * - CarRecommendationOutput - The return type for the recommendCars function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CarRecommendationInputSchema = z.object({
  numPassengers: z
    .number()
    .int()
    .min(1)
    .describe('The number of passengers, must be at least 1.'),
  luggageAmount: z
    .string()
    .describe(
      'The amount of luggage (small, medium, large) that the car needs to accommodate.'
    ),
  plannedActivities: z
    .string()
    .describe(
      'The planned activities (e.g., city driving, off-roading, long highway trips).' + 
      'Provide a detailed description of the activities the car will be used for.'
    ),
  budget: z.number().describe('The budget for the car rental in INR'),
});
export type CarRecommendationInput = z.infer<typeof CarRecommendationInputSchema>;

const CarRecommendationOutputSchema = z.object({
  recommendedCarType: z
    .string()
    .describe(
      'The recommended car type (e.g., sedan, SUV, minivan) based on the user preferences.'
    ),
  reasoning: z
    .string()
    .describe(
      'The detailed reasoning for the car recommendation, considering the number of passengers, luggage, and planned activities.'
    ),
});
export type CarRecommendationOutput = z.infer<typeof CarRecommendationOutputSchema>;

export async function recommendCars(input: CarRecommendationInput): Promise<CarRecommendationOutput> {
  return recommendCarsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'carRecommendationPrompt',
  input: {schema: CarRecommendationInputSchema},
  output: {schema: CarRecommendationOutputSchema},
  prompt: `You are an expert car rental assistant in India. A user is looking to rent a car, and you must recommend a car type based on their needs.

Consider the following information about the user's trip:

Number of Passengers: {{{numPassengers}}}
Luggage Amount: {{{luggageAmount}}}
Planned Activities: {{{plannedActivities}}}
Budget: {{{budget}}}

Based on this information, recommend a car type and explain your reasoning. Be as detailed as possible when explaining the recommendation, but also be concise.

{{#if budget}}
Considering the budget of {{{budget}}} INR, ensure the car is within this price range, if possible.
{{/if}}
`,
});

const recommendCarsFlow = ai.defineFlow(
  {
    name: 'recommendCarsFlow',
    inputSchema: CarRecommendationInputSchema,
    outputSchema: CarRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
