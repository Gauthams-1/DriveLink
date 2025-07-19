'use server';

import { recommendCars, type CarRecommendationInput } from '@/ai/flows/car-recommendation';
import { generateAvatar, type GenerateAvatarInput } from '@/ai/flows/generate-avatar';
import { z } from 'zod';

const CarRecommendationSchema = z.object({
  numPassengers: z.coerce.number().int().min(1, 'Number of passengers is required.'),
  luggageAmount: z.string().min(1, 'Luggage amount is required.'),
  plannedActivities: z.string().min(1, 'Planned activities are required.'),
  budget: z.coerce.number().min(0, 'Budget is required.'),
});

export async function getCarRecommendation(
  prevState: any,
  formData: FormData
) {
  const validatedFields = CarRecommendationSchema.safeParse({
    numPassengers: formData.get('numPassengers'),
    luggageAmount: formData.get('luggageAmount'),
    plannedActivities: formData.get('plannedActivities'),
    budget: formData.get('budget'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors,
      recommendedCarType: null,
      reasoning: null,
    }
  }

  const rawFormData: CarRecommendationInput = validatedFields.data;
  
  try {
    const result = await recommendCars(rawFormData);
    return {
      message: 'success',
      ...result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while getting recommendations.',
      recommendedCarType: null,
      reasoning: null,
    };
  }
}

const GenerateAvatarSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters.'),
});

export async function generateAvatarAction(prevState: any, formData: FormData) {
  const validatedFields = GenerateAvatarSchema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.prompt?.[0] || 'Invalid input.',
      avatarDataUri: null,
    }
  }

  const input: GenerateAvatarInput = validatedFields.data;

  try {
    const result = await generateAvatar(input);
    return {
      message: 'success',
      ...result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred during image generation.',
      avatarDataUri: null,
    };
  }
}
