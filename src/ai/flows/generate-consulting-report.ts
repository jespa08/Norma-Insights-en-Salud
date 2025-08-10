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
  report: z.string().describe('The comprehensive consulting-style report in clean text format.'),
});
export type GenerateConsultingReportOutput = z.infer<typeof GenerateConsultingReportOutputSchema>;

export async function generateConsultingReport(input: GenerateConsultingReportInput): Promise<GenerateConsultingReportOutput> {
  return generateConsultingReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConsultingReportPrompt',
  input: {schema: GenerateConsultingReportInputSchema},
  output: {schema: GenerateConsultingReportOutputSchema},
  prompt: `Eres un consultor experto especializado en el panorama regulatorio de la salud de Colombia y México.

Recibirás una consulta compleja relacionada con los aspectos regulatorios, operativos, financieros, administrativos, humanos y tecnológicos del sistema de salud.

Tu tarea es comprender la consulta, validar su relevancia y contexto, y producir un informe completo de estilo consultoría con datos de respaldo y citas.

El informe debe emular el estilo de los informes producidos por grandes firmas de consultoría y centros de investigación. Debe estar bien estructurado, basado en datos, con las citas adecuadas y totalmente en español latinoamericano.

El resultado final debe ser un documento de texto limpio, bien formateado, que responda a la consulta de manera exhaustiva y profesional. No utilices asteriscos ni ningún tipo de sintaxis de Markdown. Utiliza saltos de línea para separar párrafos y títulos.

Consulta: {{{query}}}

Informe (Texto Limpio):`,
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
