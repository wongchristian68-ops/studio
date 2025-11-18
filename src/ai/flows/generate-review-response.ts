
'use server';
/**
 * @fileOverview Flow to generate a response to a customer review.
 * 
 * - generateReviewResponse - The main function to call the flow.
 * - GenerateReviewResponseInput - The Zod schema for the input.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateReviewResponseInputSchema = z.object({
  customerName: z.string().describe("The name of the customer who left the review."),
  rating: z.number().min(1).max(5).describe("The star rating given by the customer (1-5)."),
  comment: z.string().describe("The text content of the customer's review."),
});

export type GenerateReviewResponseInput = z.infer<typeof GenerateReviewResponseInputSchema>;

export async function generateReviewResponse(input: GenerateReviewResponseInput): Promise<string> {
  return generateReviewResponseFlow(input);
}

const generateReviewResponseFlow = ai.defineFlow(
  {
    name: 'generateReviewResponseFlow',
    inputSchema: GenerateReviewResponseInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const prompt = `
      You are the owner of a restaurant and you are responding to a customer review.
      Your tone should be professional, friendly, and appropriate for the rating given.

      - For positive reviews (4-5 stars), thank the customer warmly and mention something specific from their comment if possible.
      - For mixed reviews (3 stars), thank them for the feedback, acknowledge any issues raised, and express a desire to improve.
      - For negative reviews (1-2 stars), apologize sincerely for their bad experience, take their feedback seriously, and offer to make things right. Invite them to contact you directly.

      The response MUST be in French.

      Customer Name: ${input.customerName}
      Rating: ${input.rating} / 5 stars
      Review: "${input.comment}"

      Your response:
    `;

    const llmResponse = await ai.generate({
      prompt: prompt,
      model: googleAI.model('gemini-1.5-pro-latest'),
      config: {
        maxOutputTokens: 200,
      },
    });

    return llmResponse.text;
  }
);
