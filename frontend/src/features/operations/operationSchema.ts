import { z } from 'zod/v4';

export const operationSchema = z.object({
  orderProjectNumber: z
    .string()
    .min(1, 'Numer zlecenia jest wymagany')
    .max(30, 'Maksymalnie 30 znaków'),
  shortDescription: z
    .string()
    .min(1, 'Krótki opis jest wymagany')
    .max(100, 'Maksymalnie 100 znaków'),
  proposedDateFrom: z.string().optional().or(z.literal('')),
  proposedDateTo: z.string().optional().or(z.literal('')),
  activities: z
    .array(
      z.object({
        activityType: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .min(1, 'Wybierz co najmniej jeden rodzaj czynności'),
  additionalInfo: z
    .string()
    .max(500, 'Maksymalnie 500 znaków')
    .optional()
    .or(z.literal('')),
  routeLengthKm: z
    .number({ error: 'Wymagana liczba całkowita' })
    .int('Musi być liczbą całkowitą')
    .min(0, 'Minimum 0 km'),
  plannedDateFrom: z.string().optional().or(z.literal('')),
  plannedDateTo: z.string().optional().or(z.literal('')),
  postCompletionNotes: z
    .string()
    .max(500, 'Maksymalnie 500 znaków')
    .optional()
    .or(z.literal('')),
});

export type OperationFormData = z.infer<typeof operationSchema>;
