import { z } from 'zod/v4';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const crewSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'Imię jest wymagane')
      .max(100, 'Maksymalnie 100 znaków'),
    lastName: z
      .string()
      .min(1, 'Nazwisko jest wymagane')
      .max(100, 'Maksymalnie 100 znaków'),
    email: z
      .string()
      .min(1, 'Email jest wymagany')
      .max(100, 'Maksymalnie 100 znaków')
      .regex(emailRegex, 'Nieprawidłowy format adresu email'),
    weight: z
      .number({ error: 'Wymagana liczba całkowita' })
      .int('Musi być liczbą całkowitą')
      .min(30, 'Minimum 30 kg')
      .max(200, 'Maksimum 200 kg'),
    role: z.enum(['pilot', 'observer']),
    pilotLicenseNumber: z
      .string()
      .max(30, 'Maksymalnie 30 znaków')
      .optional()
      .or(z.literal('')),
    licenseExpiryDate: z.string().optional().or(z.literal('')),
    trainingExpiryDate: z.string().min(1, 'Data szkolenia jest wymagana'),
  })
  .refine(
    (data) => {
      if (data.role === 'pilot') {
        return !!data.pilotLicenseNumber;
      }
      return true;
    },
    {
      message: 'Numer licencji pilota jest wymagany dla pilotów',
      path: ['pilotLicenseNumber'],
    },
  )
  .refine(
    (data) => {
      if (data.role === 'pilot') {
        return !!data.licenseExpiryDate;
      }
      return true;
    },
    {
      message: 'Data ważności licencji jest wymagana dla pilotów',
      path: ['licenseExpiryDate'],
    },
  );

export type CrewFormData = z.infer<typeof crewSchema>;
