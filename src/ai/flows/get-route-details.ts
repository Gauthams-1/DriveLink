'use server';

/**
 * @fileOverview An AI flow to get detailed route information for a trip.
 *
 * - getRouteDetails - A function that provides route suggestions, petrol pumps, restaurants, and road conditions.
 * - GetRouteDetailsInput - The input type for the getRouteDetails function.
 * - GetRouteDetailsOutput - The return type for the getRouteDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRouteDetailsInputSchema = z.object({
  pickup: z.string().describe('The starting point of the trip.'),
  dropoff: z.string().describe('The destination of the trip.'),
});
export type GetRouteDetailsInput = z.infer<typeof GetRouteDetailsInputSchema>;

const GetRouteDetailsOutputSchema = z.object({
  suggestedRoutes: z.array(z.object({
    name: z.string().describe('The name of the route (e.g., "Fastest Route").'),
    description: z.string().describe('A brief description of the route.'),
  })).describe('A list of suggested routes.'),
  petrolPumps: z.array(z.object({
    name: z.string().describe('The name of the petrol pump.'),
    brand: z.string().describe('The brand of the petrol pump (e.g., "Indian Oil").'),
  })).describe('A list of reliable petrol pumps along the main route.'),
  restaurants: z.array(z.object({
    name: z.string().describe('The name of the restaurant.'),
    cuisine: z.string().describe('The type of cuisine offered (e.g., "South Indian").'),
  })).describe('A list of recommended restaurants or dhabas.'),
  roadConditions: z.string().describe('A summary of the expected road conditions.'),
});
export type GetRouteDetailsOutput = z.infer<typeof GetRouteDetailsOutputSchema>;

export async function getRouteDetails(input: GetRouteDetailsInput): Promise<GetRouteDetailsOutput> {
  return getRouteDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRouteDetailsPrompt',
  input: {schema: GetRouteDetailsInputSchema},
  output: {schema: GetRouteDetailsOutputSchema},
  prompt: `You are a travel assistant for Indian roads. A user has booked a car from '{{{pickup}}}' to '{{{dropoff}}}'.

Your task is to provide helpful information for their trip.

1.  **Suggested Routes**: Suggest 2-3 different routes (e.g., fastest, scenic).
2.  **Petrol Pumps**: List 3-4 reliable petrol pumps (like Indian Oil, HP, BP) along the primary route.
3.  **Restaurants**: Recommend 3-4 good restaurants or dhabas on the way, mentioning the type of food they serve.
4.  **Road Conditions**: Provide a brief summary of the expected road conditions (e.g., "Mostly smooth 4-lane highway with some city traffic near Pune.").

Your response must be in the specified JSON format.`,
});

const getRouteDetailsFlow = ai.defineFlow(
  {
    name: 'getRouteDetailsFlow',
    inputSchema: GetRouteDetailsInputSchema,
    outputSchema: GetRouteDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
