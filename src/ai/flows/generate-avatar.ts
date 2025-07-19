'use server';

/**
 * @fileOverview AI-powered avatar generation flow.
 *
 * This file defines a Genkit flow that generates an avatar image based on a text prompt.
 * - generateAvatar - A function that handles the avatar generation process.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAvatarInputSchema = z.object({
    prompt: z.string().describe('A text description of the avatar to generate.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
    avatarDataUri: z
        .string()
        .describe(
            "The generated avatar image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
    return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
    {
        name: 'generateAvatarFlow',
        inputSchema: GenerateAvatarInputSchema,
        outputSchema: GenerateAvatarOutputSchema,
    },
    async (input) => {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: `Generate a professional, high-quality, circular avatar suitable for a user profile. The user has requested the following: "${input.prompt}". The avatar should be clean, modern, and centered.`,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        
        if (!media.url) {
            throw new Error('Image generation failed.');
        }

        return {
            avatarDataUri: media.url,
        };
    }
);
