
'use server';

/**
 * @fileOverview An AI flow to find nearby mechanics for a vehicle breakdown.
 *
 * - findMechanics - A function that finds a list of mechanics based on user's location and problem description.
 * - FindMechanicInput - The input type for the findMechanics function.
 * - FindMechanicOutput - The return type for the findMechanics function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAllRegisteredMechanics } from '@/lib/data';

const FindMechanicInputSchema = z.object({
  location: z.string().describe('The current location of the user who needs help (e.g., "Andheri, Mumbai").'),
  problemDescription: z.string().describe('A detailed description of the vehicle problem.'),
});
export type FindMechanicInput = z.infer<typeof FindMechanicInputSchema>;

const FindMechanicOutputSchema = z.array(z.object({
    id: z.number().describe("The ID of the recommended mechanic."),
    name: z.string().describe("The name of the recommended mechanic."),
    location: z.string().describe("The location of the mechanic's workshop."),
    phone: z.string().describe("The mechanic's contact phone number."),
    rating: z.number().describe("The mechanic's customer rating out of 5."),
    specialty: z.string().describe("The mechanic's area of expertise."),
    avatarUrl: z.string().describe("A URL to the mechanic's avatar image."),
    reasoning: z.string().describe("A brief explanation for why this mechanic was chosen."),
}));
export type FindMechanicOutput = z.infer<typeof FindMechanicOutputSchema>;


export async function findMechanics(input: FindMechanicInput): Promise<FindMechanicOutput> {
  return findMechanicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findMechanicsPrompt',
  input: {
    schema: z.object({
        problemDescription: FindMechanicInputSchema.shape.problemDescription,
        location: FindMechanicInputSchema.shape.location,
        availableMechanics: z.string().describe("A JSON string of available mechanics.")
    })
  },
  output: { schema: FindMechanicOutputSchema },
  prompt: `You are an expert AI assistant for a vehicle breakdown service called DriveLink. Your task is to find the most suitable mechanics for a user in distress.

User's Location: {{{location}}}
User's Problem: {{{problemDescription}}}

Here is a list of available partner mechanics:
{{{availableMechanics}}}

Analyze the user's problem and location. Select a list of the MOST suitable mechanics from the list who are closest to the user and whose specialty is relevant to the described problem. Rank the list with the best match first. Provide a brief, user-friendly 'reasoning' for each choice. For example: "Rajesh is the closest mechanic to you and specializes in general repairs, which is perfect for this issue."

Your response must be in the specified JSON format, returning an array of mechanics.`,
});

const findMechanicsFlow = ai.defineFlow(
  {
    name: 'findMechanicsFlow',
    inputSchema: FindMechanicInputSchema,
    outputSchema: FindMechanicOutputSchema,
  },
  async (input) => {
    // Fetch registered mechanics from the user data system.
    const allMechanics = await getAllRegisteredMechanics();
    const availableMechanics = JSON.stringify(allMechanics, null, 2);

    const { output } = await prompt({
        ...input,
        availableMechanics: availableMechanics,
    });
    
    return output!;
  }
);
