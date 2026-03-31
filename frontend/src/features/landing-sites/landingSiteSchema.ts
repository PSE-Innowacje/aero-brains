import { z } from 'zod/v4';

export const landingSiteSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
  lat: z
    .number({ error: 'Wymagana liczba' })
    .min(-90, 'Minimum -90')
    .max(90, 'Maksimum 90'),
  lng: z
    .number({ error: 'Wymagana liczba' })
    .min(-180, 'Minimum -180')
    .max(180, 'Maksimum 180'),
});

export type LandingSiteFormData = z.infer<typeof landingSiteSchema>;
