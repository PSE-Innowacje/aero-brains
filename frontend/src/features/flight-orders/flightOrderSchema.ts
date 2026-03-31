import { z } from 'zod/v4';

export const flightOrderSchema = z.object({
  plannedStartDateTime: z
    .string()
    .min(1, 'Planowana data startu jest wymagana'),
  plannedLandingDateTime: z
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
  startLandingSiteId: z
    .number({ error: 'Miejsce startu jest wymagane' })
    .int(),
  endLandingSiteId: z
    .number({ error: 'Miejsce lądowania jest wymagane' })
    .int(),
  selectedOperationIds: z
    .array(z.number().int())
    .min(1, 'Wybierz co najmniej jedną operację'),
  estimatedRouteDistance: z
    .number({ error: 'Wymagana liczba całkowita' })
    .int('Musi być liczbą całkowitą')
    .min(0, 'Minimum 0 km'),
  actualStartDateTime: z.string().optional().or(z.literal('')),
  actualLandingDateTime: z.string().optional().or(z.literal('')),
});

export type FlightOrderFormData = z.infer<typeof flightOrderSchema>;
