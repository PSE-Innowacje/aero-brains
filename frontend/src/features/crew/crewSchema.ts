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
      .number({ error: 'Wymagana liczba od 30 do 200' })
      .int('Wymagana liczba od 30 do 200')
      .min(30, 'Wymagana liczba od 30 do 200')
      .max(200, 'Wymagana liczba od 30 do 200'),
    role: z.string().min(1, 'Rola jest wymagana'),
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
      if (data.role === 'PILOT') {
        return !!data.pilotLicenseNumber;
      }
      return true;
    },
    {
      message: 'Nr licencji wymagany dla pilota',
      path: ['pilotLicenseNumber'],
    },
  )
  .refine(
    (data) => {
      if (data.role === 'PILOT') {
        return !!data.licenseExpiryDate;
      }
      return true;
    },
    {
      message: 'Data licencji wymagana dla pilota',
      path: ['licenseExpiryDate'],
    },
  );

export type CrewFormData = z.infer<typeof crewSchema>;
