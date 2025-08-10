// src/ai/flows/generate-consulting-report.ts
'use server';

/**
 * @fileOverview Generates a consulting-style report on the healthcare regulatory landscape.
 *
 * - generateConsultingReport - A function that handles the report generation process.
 * - GenerateConsultingReportInput - The input type for the generateConsultingReport function.
 * - GenerateConsultingReportOutput - The return type for the generateConsultingReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConsultingReportInputSchema = z.object({
  query: z.string().describe('The complex query related to the healthcare regulatory landscape.'),
});
export type GenerateConsultingReportInput = z.infer<typeof GenerateConsultingReportInputSchema>;

const GenerateConsultingReportOutputSchema = z.object({
  report: z.string().describe('The comprehensive consulting-style report in Markdown format.'),
});
export type GenerateConsultingReportOutput = z.infer<typeof GenerateConsultingReportOutputSchema>;

export async function generateConsultingReport(input: GenerateConsultingReportInput): Promise<GenerateConsultingReportOutput> {
  return generateConsultingReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConsultingReportPrompt',
  input: {schema: GenerateConsultingReportInputSchema},
  output: {schema: GenerateConsultingReportOutputSchema},
  prompt: `You are an expert consultant specializing in the healthcare regulatory landscape of Colombia and Mexico.

You will receive a complex query related to the regulatory, operational, financial, administrative, human, and technological aspects of the healthcare system.

Your task is to understand the query, validate its relevance and context, and produce a comprehensive consulting-style report with data support and citations.

The report should emulate the style of reports produced by large consulting firms and research centers. It should be well-structured, data-driven, and properly cited.

The final output should be a well-formatted Markdown document that addresses the query in a thorough and professional manner. The report should be no more than 30 pages and avoid unnecessary filler.

Query: {{{query}}}

Report (Markdown):`,
});

const generateConsultingReportFlow = ai.defineFlow(
  {
    name: 'generateConsultingReportFlow',
    inputSchema: GenerateConsultingReportInputSchema,
    outputSchema: GenerateConsultingReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
