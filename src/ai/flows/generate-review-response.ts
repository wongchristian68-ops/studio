
'use server';
/**
 * @fileOverview Flow to generate a response to a customer review.
 * 
 * - generateReviewResponse - The main function to call the flow.
 * - GenerateReviewResponseInput - The Zod schema for the input.
 */

import { z } from 'zod';

const GenerateReviewResponseInputSchema = z.object({
  customerName: z.string().describe("The name of the customer who left the review."),
  rating: z.number().min(1).max(5).describe("The star rating given by the customer (1-5)."),
  comment: z.string().describe("The text content of the customer's review."),
});

export type GenerateReviewResponseInput = z.infer<typeof GenerateReviewResponseInputSchema>;

// This is a mock implementation to simulate the AI response.
const generateMockResponse = (input: GenerateReviewResponseInput): string => {
    if (input.rating >= 4) {
        return `Bonjour ${input.customerName}, un grand merci pour votre retour positif ! Nous sommes ravis que vous ayez apprécié votre expérience. À bientôt !`;
    }
    if (input.rating === 3) {
        return `Bonjour ${input.customerName}, merci d'avoir pris le temps de nous faire part de vos remarques. Nous prenons note de vos commentaires pour nous améliorer.`;
    }
    return `Bonjour ${input.customerName}, nous sommes sincèrement désolés d'apprendre que votre expérience n'a pas été à la hauteur de vos attentes. Pourriez-vous nous contacter directement pour que nous puissions en discuter ?`;
}

export async function generateReviewResponse(input: GenerateReviewResponseInput): Promise<string> {
  // Simulate a short network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockResponse(input);
}
