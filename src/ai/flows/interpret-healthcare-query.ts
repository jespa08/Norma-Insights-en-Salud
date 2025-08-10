'use server';

/**
 * @fileOverview A Genkit flow that interprets complex healthcare queries for Colombia and Mexico.
 *
 * - interpretHealthcareQuery - A function that interprets the query and returns its interpretation.
 * - InterpretHealthcareQueryInput - The input type for the interpretHealthcareQuery function.
 * - InterpretHealthcareQueryOutput - The return type for the interpretHealthcareQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretHealthcareQueryInputSchema = z.object({
  query: z
    .string()
    .describe("The user's complex query related to the healthcare system in Colombia or Mexico."),
});
export type InterpretHealthcareQueryInput = z.infer<typeof InterpretHealthcareQueryInputSchema>;

const InterpretHealthcareQueryOutputSchema = z.object({
  interpretation: z
    .string()
    .describe('The AI-interpreted meaning of the query, including key aspects and context.'),
});
export type InterpretHealthcareQueryOutput = z.infer<typeof InterpretHealthcareQueryOutputSchema>;

export async function interpretHealthcareQuery(
  input: InterpretHealthcareQueryInput
): Promise<InterpretHealthcareQueryOutput> {
  return interpretHealthcareQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretHealthcareQueryPrompt',
  input: {schema: InterpretHealthcareQueryInputSchema},
  output: {schema: InterpretHealthcareQueryOutputSchema},
  prompt: `You are an expert in understanding complex queries related to the healthcare system in Colombia and Mexico.

  Your task is to interpret the user's query and extract the key aspects, context, and intent.
  Provide a clear and concise interpretation that captures the essence of the query.

  User Query: {{{query}}}

  Interpretation:`, // Output should be a string interpreting the meaning of the query.
});

const interpretHealthcareQueryFlow = ai.defineFlow(
  {
    name: 'interpretHealthcareQueryFlow',
    inputSchema: InterpretHealthcareQueryInputSchema,
    outputSchema: InterpretHealthcareQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
