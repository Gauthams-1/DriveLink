
'use server';

/**
 * @fileOverview Finds nearby mechanics for a vehicle breakdown.
 *
 * - findMechanics - A function that finds a list of mechanics based on user's location and problem description.
 * - FindMechanicInput - The input type for the findMechanics function.
 * - FindMechanicOutput - The return type for the findMechanics function.
 */

import { getAllRegisteredMechanics } from '@/lib/data';
import { z } from 'zod';

const FindMechanicInputSchema = z.object({
  location: z.string().describe('The current location of the user who needs help (e.g., "Andheri, Mumbai").'),
  problemDescription: z.string().describe('A detailed description of the vehicle problem.'),
});
export type FindMechanicInput = z.infer<typeof FindMechanicInputSchema>;

const FindMechanicOutputSchema = z.array(z.object({
    id: z.number().describe("A unique ID for the mechanic."),
    name: z.string().describe("The name of the mechanic."),
    location: z.string().describe("The workshop location, near the user's location."),
    phone: z.string().describe("The mechanic's mobile number."),
    rating: z.number().min(0).max(5).describe("A customer rating between 0 and 5.0."),
    specialty: z.string().describe("The mechanic's area of expertise, relevant to the user's problem."),
    avatarUrl: z.string().url().describe("A URL for the mechanic's avatar image."),
}));
export type FindMechanicOutput = z.infer<typeof FindMechanicOutputSchema>;


export async function findMechanics(input: FindMechanicInput): Promise<FindMechanicOutput> {
  // Directly fetch registered mechanics, bypassing AI.
  const mechanics = await getAllRegisteredMechanics();
  
  // In a real application, you might filter mechanics by location or specialty here.
  // For now, we'll return a subset of the available mechanics.
  return mechanics.slice(0, 3);
}
