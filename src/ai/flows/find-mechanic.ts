
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

const FindMechanicInputSchema = z.object({
  location: z.string().describe('The current location of the user who needs help (e.g., "Andheri, Mumbai").'),
  problemDescription: z.string().describe('A detailed description of the vehicle problem.'),
});
export type FindMechanicInput = z.infer<typeof FindMechanicInputSchema>;

const FindMechanicOutputSchema = z.array(z.object({
    id: z.number().describe("A unique ID for the generated mechanic."),
    name: z.string().describe("A plausible Indian name for the generated mechanic."),
    location: z.string().describe("A plausible location for the mechanic's workshop, near the user's location."),
    phone: z.string().describe("A fictional but realistic-looking Indian mobile number."),
    rating: z.number().min(4).max(5).describe("A high customer rating between 4.0 and 5.0."),
    specialty: z.string().describe("The mechanic's area of expertise, directly relevant to the user's problem."),
    avatarUrl: z.string().url().describe("A placeholder URL for the mechanic's avatar image."),
    reasoning: z.string().describe("A brief explanation for why this generated mechanic is a good fit for the problem."),
}));
export type FindMechanicOutput = z.infer<typeof FindMechanicOutputSchema>;


export async function findMechanics(input: FindMechanicInput): Promise<FindMechanicOutput> {
  return findMechanicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findMechanicsPrompt',
  input: {
    schema: FindMechanicInputSchema
  },
  output: { schema: FindMechanicOutputSchema },
  prompt: `You are an expert AI assistant for a vehicle breakdown service in India. Your task is to generate suitable mechanic profiles for a user in distress.

User's Location: {{{location}}}
User's Problem: {{{problemDescription}}}

Your task is to randomly generate a list of 2 to 3 fictional, but highly plausible, mechanic profiles who would be perfect for this job.

- Generate names, locations (near the user), and phone numbers that seem authentic for India.
- The mechanic's 'specialty' must be directly related to the user's 'problemDescription'. For example, if the problem is a 'flat tire', the specialty should be 'Tire Repair and Replacement'.
- The 'rating' should always be high (between 4.0 and 5.0).
- The 'avatarUrl' should be a placeholder: 'https://placehold.co/100x100.png'.
- Provide a brief, user-friendly 'reasoning' for each choice. For example: "Rajesh specializes in engine diagnostics and is located nearby, making him a great choice for this issue."

Your response must be a valid JSON array of 2 or 3 mechanic objects matching the output schema.
`,
});

const findMechanicsFlow = ai.defineFlow(
  {
    name: 'findMechanicsFlow',
    inputSchema: FindMechanicInputSchema,
    outputSchema: FindMechanicOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
