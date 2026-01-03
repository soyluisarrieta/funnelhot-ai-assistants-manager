import { LANGUAGES, TONES } from '@/constants/assistant-options'
import { z } from 'zod'

export const ResponseLengthSchema = z
  .object({
    short: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    long: z.number().min(0).max(100),
  })
  .superRefine((data, ctx) => {
    const total = data.short + data.medium + data.long

    if (total !== 100) {
      ctx.addIssue({
        code: 'custom',
        message: 'La suma de los porcentajes debe ser 100%',
        path: [],
      })
    }
  })

export const assistantSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  language: z.enum(LANGUAGES, 'Seleccione un idioma válido'),
  tone: z.enum(TONES, 'Seleccione una tonalidad válida'),
  responseLength: ResponseLengthSchema,
  audioEnabled: z.boolean(),
})

export type AssistantFormData = z.infer<typeof assistantSchema>