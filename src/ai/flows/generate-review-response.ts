
'use server';
/**
 * @fileOverview Flow to generate a response to a customer review.
 * 
 * - generateReviewResponse - The main function to call the flow.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { GenerateReviewResponseInputSchema } from './types';
import type { GenerateReviewResponseInput } from './types';


const generateReviewResponseFlow = ai.defineFlow(
  {
    name: 'generateReviewResponseFlow',
    inputSchema: GenerateReviewResponseInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const prompt = `
      You are an AI assistant for a restaurant owner. Your task is to generate a professional and friendly response to a customer review.
      The response should be in the same language as the customer's original comment.

      Customer Name: ${input.customerName}
      Rating: ${input.rating}/5
      Review: "${input.comment}"

      Based on the rating and the comment, please generate a suitable response.

      If the rating is high (4 or 5), thank the customer warmly.
      If the rating is average (3), thank them for the feedback and be neutral.
      If the rating is low (1 or 2), apologize sincerely and invite them to share more details directly.
    `;

    const { text } = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-1.5-flash-preview',
    });

    return text;
  }
);


export async function generateReviewResponse(input: GenerateReviewResponseInput): Promise<string> {
    return await generateReviewResponseFlow(input);
}
