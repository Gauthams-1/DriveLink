'use server';

/**
 * @fileOverview An AI flow to find the nearest and most suitable mechanic for a vehicle breakdown.
 *
 * - findMechanic - A function that finds a mechanic based on user's location and problem description.
 * - FindMechanicInput - The input type for the findMechanic function.
 * - FindMechanicOutput - The return type for the findMechanic function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { mechanics } from '@/lib/data';
import type { Mechanic } from '@/lib/types';

const FindMechanicInputSchema = z.object({
  location: z.string().describe('The current location of the user who needs help (e.g., "Andheri, Mumbai").'),
  problemDescription: z.string().describe('A detailed description of the vehicle problem.'),
});
export type FindMechanicInput = z.infer<typeof FindMechanicInputSchema>;

const FindMechanicOutputSchema = z.object({
    id: z.number().describe("The ID of the recommended mechanic."),
    name: z.string().describe("The name of the recommended mechanic."),
    location: z.string().describe("The location of the mechanic's workshop."),
    phone: z.string().describe("The mechanic's contact phone number."),
    rating: z.number().describe("The mechanic's customer rating out of 5."),
    specialty: z.string().describe("The mechanic's area of expertise."),
    avatarUrl: z.string().describe("A URL to the mechanic's avatar image."),
    reasoning: z.string().describe("A brief explanation for why this mechanic was chosen."),
});
export type FindMechanicOutput = z.infer<typeof FindMechanicOutputSchema>;


export async function findMechanic(input: FindMechanicInput): Promise<FindMechanicOutput> {
  return findMechanicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findMechanicPrompt',
  input: {
    schema: z.object({
        problemDescription: FindMechanicInputSchema.shape.problemDescription,
        location: FindMechanicInputSchema.shape.location,
        availableMechanics: z.string().describe("A JSON string of available mechanics.")
    })
  },
  output: { schema: FindMechanicOutputSchema },
  prompt: `You are an expert AI assistant for a vehicle breakdown service called DriveLink. Your task is to find the best available mechanic for a user in distress.

User's Location: {{{location}}}
User's Problem: {{{problemDescription}}}

Here is a list of available partner mechanics:
{{{availableMechanics}}}

Analyze the user's problem and location. Select the single BEST mechanic from the list who is closest to the user and whose specialty is most relevant to the described problem. Prioritize proximity, but strongly consider specialty if the problem is specific (e.g., engine, tires).

Your response must be in the specified JSON format. Provide a brief, user-friendly 'reasoning' for your choice. For example: "Rajesh is the closest mechanic to you and specializes in general repairs, which is perfect for this issue."`,
});

const findMechanicFlow = ai.defineFlow(
  {
    name: 'findMechanicFlow',
    inputSchema: FindMechanicInputSchema,
    outputSchema: FindMechanicOutputSchema,
  },
  async (input) => {
    // In a real app, you would query a database for mechanics near the user's location.
    // For this demo, we'll provide the whole list and let the AI figure it out.
    const availableMechanics = JSON.stringify(mechanics, null, 2);

    const { output } = await prompt({
        ...input,
        availableMechanics: availableMechanics,
    });
    
    return output!;
  }
);
