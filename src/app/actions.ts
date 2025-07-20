
'use server';

import { createCarFromPrompt, type CarRecommendationInput } from '@/ai/flows/create-car-from-prompt';
import { generateAvatar, type GenerateAvatarInput } from '@/ai/flows/generate-avatar';
import { findMechanics } from '@/ai/flows/find-mechanic';
import { addPartnerVehicle } from '@/lib/data';
import type { Car, VehicleCategory } from '@/lib/types';
import { redirect } from 'next/navigation';
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
      recommendedCar: null,
    }
  }

  const rawFormData: CarRecommendationInput = validatedFields.data;
  
  try {
    const aiGeneratedCar = await createCarFromPrompt(rawFormData);
    
    // Determine the category based on the AI-generated type
    let category: VehicleCategory = 'Car';
    if (aiGeneratedCar.type === 'Bike' || aiGeneratedCar.type === 'Scooter') {
      category = aiGeneratedCar.type;
    }

    // Save the AI-generated car to the database as a real vehicle
    // The ownerId 'ai@drivelink.com' identifies it as system-generated
    const newCar = await addPartnerVehicle(aiGeneratedCar, category, 'ai@drivelink.com');

    return {
      message: 'success',
      recommendedCar: newCar,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while getting recommendations.',
      recommendedCar: null,
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


const FindMechanicSchema = z.object({
  location: z.string().min(3, 'Location is required.'),
  problemDescription: z.string().min(10, 'Please describe the problem in more detail.'),
});

export async function findMechanicAction(prevState: any, formData: FormData) {
  const validatedFields = FindMechanicSchema.safeParse({
    location: formData.get('location'),
    problemDescription: formData.get('problemDescription'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { location, problemDescription } = validatedFields.data;
  const queryParams = new URLSearchParams({
    location,
    problemDescription,
  });

  redirect(`/support/mechanics?${queryParams.toString()}`);
}
