'use server';

import { recommendCars, type CarRecommendationInput } from '@/ai/flows/car-recommendation';
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
