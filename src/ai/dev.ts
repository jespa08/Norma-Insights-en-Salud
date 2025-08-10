import { config } from 'dotenv';
config();

import '@/ai/flows/generate-consulting-report.ts';
import '@/ai/flows/validate-regulatory-context.ts';
import '@/ai/flows/interpret-healthcare-query.ts';