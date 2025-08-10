'use server';

/**
 * @fileOverview A flow to validate the relevance and context of information extracted from regulatory documents.
 *
 * - validateRegulatoryContext - A function that handles the validation process.
 * - ValidateRegulatoryContextInput - The input type for the validateRegulatoryContext function.
 * - ValidateRegulatoryContextOutput - The return type for the validateRegulatoryContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateRegulatoryContextInputSchema = z.object({
  regulatoryText: z
    .string()
    .describe('The text extracted from a regulatory document.'),
  query: z
    .string()
    .describe('The original query that led to the extraction of this text.'),
  country: z
    .string()
    .describe('The country to which the regulatory text applies (e.g., Colombia, Mexico).'),
  regulatoryDomain: z
    .string()
    .describe('The regulatory domain (e.g., health, finance).'),
});
export type ValidateRegulatoryContextInput = z.infer<
  typeof ValidateRegulatoryContextInputSchema
>;

const ValidateRegulatoryContextOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'Whether the regulatory text is relevant and up-to-date for the given query, country, and regulatory domain.'
    ),
  reason: z
    .string()
    .describe(
      'The reasoning for the validation result, including any identified issues with relevance or context.'
    ),
});
export type ValidateRegulatoryContextOutput = z.infer<
  typeof ValidateRegulatoryContextOutputSchema
>;

export async function validateRegulatoryContext(
  input: ValidateRegulatoryContextInput
): Promise<ValidateRegulatoryContextOutput> {
  return validateRegulatoryContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateRegulatoryContextPrompt',
  input: {schema: ValidateRegulatoryContextInputSchema},
  output: {schema: ValidateRegulatoryContextOutputSchema},
  prompt: `You are an expert in regulatory compliance, specializing in the healthcare system in Colombia and Mexico.

You will receive a text extracted from a regulatory document, the original query that led to its extraction, the country to which it applies, and the regulatory domain.

Your task is to determine whether the provided text is relevant and up-to-date for the given query, country, and regulatory domain.

Respond with a boolean value indicating whether the text is valid, and a detailed explanation of your reasoning.

Query: {{{query}}}
Country: {{{country}}}
Regulatory Domain: {{{regulatoryDomain}}}
Regulatory Text: {{{regulatoryText}}}`,
});

const validateRegulatoryContextFlow = ai.defineFlow(
  {
    name: 'validateRegulatoryContextFlow',
    inputSchema: ValidateRegulatoryContextInputSchema,
    outputSchema: ValidateRegulatoryContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
