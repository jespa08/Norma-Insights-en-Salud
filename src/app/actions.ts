'use server';

import { generateConsultingReport } from '@/ai/flows/generate-consulting-report';

export async function createReport(query: string) {
  if (!query) {
    return { success: false, error: "Query cannot be empty." };
  }

  try {
    // The user request implies a multi-step process, but the provided flow
    // `generateConsultingReport` seems to be an all-in-one solution.
    // "understand the query, validate its relevance and context, and produce a comprehensive consulting-style report"
    // So we'll call it directly.
    const result = await generateConsultingReport({ query });
    if (!result.report) {
      return { success: false, error: "The AI failed to generate a report. Please try a different query." };
    }
    return { success: true, data: result };
  } catch (e) {
    console.error("Error generating report:", e);
    return { success: false, error: "An unexpected error occurred while generating the report. Please try again later." };
  }
}
