
'use server';

/**
 * @fileOverview AI-powered car creation flow.
 *
 * This file defines a Genkit flow that generates a new car object based on user preferences.
 * - createCarFromPrompt - A function that creates a car based on user preferences.
 * - CarRecommendationInput - The input type for the createCarFromPrompt function.
 * - Car - The return type for the createCarFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import type { Car } from '@/lib/types';
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


const CarSchema = z.object({
    id: z.number().describe("A unique ID for the car, set to 999."),
    name: z.string().describe("A creative and fitting name for the generated car (e.g., 'Himalayan Explorer', 'Goa Beach Cruiser')."),
    type: z.enum(['Sedan', 'SUV', 'Minivan', 'Convertible', 'Coupe', 'Bike', 'Scooter']).describe("The vehicle type that best fits the user's needs."),
    pricePerDay: z.number().describe("An appropriate price per day in INR, considering the user's budget and the car's features. Should not exceed the user's budget."),
    seats: z.number().describe("The number of seats, must match the user's requirement."),
    luggage: z.number().describe("The number of luggage bags the car can hold, corresponding to the user's luggage amount (1-2 for small, 3-4 for medium, 5+ for large)."),
    transmission: z.enum(['Automatic', 'Manual']).describe("The transmission type, defaulting to Automatic unless the user implies a preference for manual (e.g., 'driving enthusiast')."),
    mpg: z.number().describe("The fuel efficiency in kmpl. Higher for city cars, lower for large SUVs."),
    location: z.string().describe("A relevant major Indian city for the car's location based on the planned activities (e.g., 'Manali, HP' for mountains, 'Mumbai, MH' for city driving)."),
    images: z.array(z.string()).describe("An array containing a single empty string `['']` as a placeholder."),
    description: z.string().describe("A compelling and creative description for the car, highlighting why it's perfect for the user's specified trip."),
    features: z.array(z.string()).describe("A list of 3-4 key features relevant to the planned activities (e.g., '4x4 Capability', 'Panoramic Sunroof', 'Advanced Safety Suite')."),
});

export async function createCarFromPrompt(input: CarRecommendationInput): Promise<Car> {
  return createCarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createCarFromPrompt',
  input: {schema: CarRecommendationInputSchema},
  output: {schema: CarSchema},
  prompt: `You are an expert car designer for an Indian car rental service. A user is looking to rent a car, and you must generate a brand new, fictional car listing tailored to their exact needs.

Generate a complete car profile based on the following trip details:

Number of Passengers: {{{numPassengers}}}
Luggage Amount: {{{luggageAmount}}}
Planned Activities: {{{plannedActivities}}}
Budget: {{{budget}}}

**Your Task:**
Create a single JSON object representing the perfect car for this trip. Adhere strictly to the provided output schema.
- **name**: Be creative and relevant (e.g., 'Himalayan Explorer', 'Urban Navigator').
- **type**: Choose the most logical vehicle type.
- **pricePerDay**: Set a price that is attractive but realistic, and under the user's budget.
- **seats**: Must match the user's passenger count.
- **description**: Write an exciting and persuasive description.
- **features**: List 3-4 features that are highly relevant to the user's activities.
- **id**: Set the ID to 999.
- **images**: Set this to an array with a single empty string: \`[""]\`.

Your response MUST be a single, valid JSON object matching the output schema.
`,
});

const createCarFlow = ai.defineFlow(
  {
    name: 'createCarFlow',
    inputSchema: CarRecommendationInputSchema,
    outputSchema: CarSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
