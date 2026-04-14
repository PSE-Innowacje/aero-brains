import { z } from 'zod/v4';

export const helicopterSchema = z
  .object({
    registrationNumber: z
      .string()
      .min(1, 'Numer rejestracyjny jest wymagany')
      .max(30, 'Maksymalnie 30 znaków'),
    helicopterType: z
      .string()
      .min(1, 'Typ helikoptera jest wymagany')
      .max(100, 'Maksymalnie 100 znaków'),
    description: z
      .string()
      .max(100, 'Maksymalnie 100 znaków')
      .optional()
      .or(z.literal('')),
    maxCrewCount: z
      .number({ error: 'Wymagana liczba od 1 do 10' })
      .int('Wymagana liczba od 1 do 10')
      .min(1, 'Wymagana liczba od 1 do 10')
      .max(10, 'Wymagana liczba od 1 do 10'),
    maxCrewWeight: z
      .number({ error: 'Wymagana liczba od 1 do 1000' })
      .int('Wymagana liczba od 1 do 1000')
      .min(1, 'Wymagana liczba od 1 do 1000')
      .max(1000, 'Wymagana liczba od 1 do 1000'),
    status: z.string().min(1, 'Status jest wymagany'),
    inspectionExpiryDate: z.string().optional().or(z.literal('')),
    rangeKm: z
      .number({ error: 'Wymagana liczba od 1 do 1000' })
      .int('Wymagana liczba od 1 do 1000')
      .min(1, 'Wymagana liczba od 1 do 1000')
      .max(1000, 'Wymagana liczba od 1 do 1000'),
  })
  .refine(
    (data) => {
      if (data.status === 'ACTIVE') {
        return !!data.inspectionExpiryDate;
      }
      return true;
    },
    {
      message: 'Data przeglądu wymagana dla aktywnego helikoptera',
      path: ['inspectionExpiryDate'],
    },
  );

export type HelicopterFormData = z.infer<typeof helicopterSchema>;
