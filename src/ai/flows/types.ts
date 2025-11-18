
import { z } from 'zod';

export const GenerateReviewResponseInputSchema = z.object({
  customerName: z.string().describe('The name of the customer leaving the review.'),
  rating: z.number().min(1).max(5).describe('The rating the customer gave, from 1 to 5.'),
  comment: z.string().describe('The comment the customer wrote.'),
});
export type GenerateReviewResponseInput = z.infer<typeof GenerateReviewResponseInputSchema>;


export const TextToSpeechOutputSchema = z.object({
    media: z.string().describe("The base64 encoded WAV audio data URI."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
