import { z } from 'zod/v4';

export const flightOrderSchema = z.object({
  plannedStartTime: z
    .string()
    .min(1, 'Planowana data startu jest wymagana'),
  plannedEndTime: z
    .string()
    .min(1, 'Planowana data lądowania jest wymagana'),
  pilotId: z
    .number({ error: 'Pilot jest wymagany' })
    .int(),
  helicopterId: z
    .number({ error: 'Helikopter jest wymagany' })
    .int(),
  crewMemberIds: z
    .array(z.number().int()),
  departureSiteId: z
    .number({ error: 'Miejsce startu jest wymagane' })
    .int(),
  arrivalSiteId: z
    .number({ error: 'Miejsce lądowania jest wymagane' })
    .int(),
  operationIds: z
    .array(z.number().int())
    .min(1, 'Wybierz co najmniej jedną operację'),
  estimatedRouteLengthKm: z
    .number({ error: 'Wymagana liczba całkowita' })
    .int('Musi być liczbą całkowitą')
    .min(0, 'Minimum 0 km'),
  actualStartTime: z.string().optional().or(z.literal('')),
  actualEndTime: z.string().optional().or(z.literal('')),
});

export type FlightOrderFormData = z.infer<typeof flightOrderSchema>;
