import { z } from 'zod/v4';

export const helicopterSchema = z
  .object({
    registrationNumber: z
      .string()
      .min(1, 'Numer rejestracyjny jest wymagany')
      .max(30, 'Maksymalnie 30 znaków'),
    helicopterType: z
      .string()
      .min(1, 'Typ jest wymagany')
      .max(100, 'Maksymalnie 100 znaków'),
    description: z
      .string()
      .max(100, 'Maksymalnie 100 znaków')
      .optional()
      .or(z.literal('')),
    maxCrewCount: z
      .number({ error: 'Wymagana liczba całkowita' })
      .int('Musi być liczbą całkowitą')
      .min(1, 'Minimum 1')
      .max(10, 'Maksimum 10'),
    maxCrewWeight: z
      .number({ error: 'Wymagana liczba całkowita' })
      .int('Musi być liczbą całkowitą')
      .min(1, 'Minimum 1 kg')
      .max(1000, 'Maksimum 1000 kg'),
    status: z.string(),
    inspectionExpiryDate: z.string().optional().or(z.literal('')),
    rangeKm: z
      .number({ error: 'Wymagana liczba całkowita' })
      .int('Musi być liczbą całkowitą')
      .min(1, 'Minimum 1 km')
      .max(1000, 'Maksimum 1000 km'),
  })
  .refine(
    (data) => {
      if (data.status === 'ACTIVE') {
        return !!data.inspectionExpiryDate;
      }
      return true;
    },
    {
      message: 'Data przeglądu jest wymagana dla aktywnych helikopterów',
      path: ['inspectionExpiryDate'],
    },
  );

export type HelicopterFormData = z.infer<typeof helicopterSchema>;
