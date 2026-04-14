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
    .int()
    .min(1, 'Pilot jest wymagany'),
  helicopterId: z
    .number({ error: 'Helikopter jest wymagany' })
    .int()
    .min(1, 'Helikopter jest wymagany'),
  crewMemberIds: z
    .array(z.number().int()),
  departureSiteId: z
    .number({ error: 'Miejsce startu jest wymagane' })
    .int()
    .min(1, 'Miejsce startu jest wymagane'),
  arrivalSiteId: z
    .number({ error: 'Miejsce lądowania jest wymagane' })
    .int()
    .min(1, 'Miejsce lądowania jest wymagane'),
  operationIds: z
    .array(z.number().int())
    .min(1, 'Wybierz co najmniej jedną operację'),
  estimatedRouteLengthKm: z
    .number({ error: 'Wymagana liczba całkowita' })
    .int('Wymagana liczba całkowita')
    .min(0, 'Wymagana liczba całkowita'),
  actualStartTime: z.string().optional().or(z.literal('')),
  actualEndTime: z.string().optional().or(z.literal('')),
  actualRouteLengthKm: z.number().int().min(0).optional(),
});

export type FlightOrderFormData = z.infer<typeof flightOrderSchema>;

export const settleFlightOrderSchema = z.object({
  actualStartTime: z.string().min(1, 'Rzeczywista data startu jest wymagana'),
  actualEndTime: z.string().min(1, 'Rzeczywista data lądowania jest wymagana'),
  actualRouteLengthKm: z
    .number({ error: 'Rzeczywista długość trasy jest wymagana' })
    .int()
    .min(1, 'Rzeczywista długość trasy musi wynosić co najmniej 1 km'),
});

export type SettleFlightOrderFormData = z.infer<typeof settleFlightOrderSchema>;
