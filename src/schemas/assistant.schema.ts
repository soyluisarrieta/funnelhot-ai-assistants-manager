import { LANGUAGES, TONES } from '@/constants/assistant-options';
import { z } from 'zod';

export const ResponseLengthSchema = z
  .object({
    short: z.number(),
    medium: z.number(),
    long: z.number(),
  });

export const assistantSchema = z.object({
  name: z.string(),
  language: z.enum(LANGUAGES),
  tone: z.enum(TONES),
  responseLength: ResponseLengthSchema,
  audioEnabled: z.boolean(),
});

export type AssistantFormData = z.infer<typeof assistantSchema>;