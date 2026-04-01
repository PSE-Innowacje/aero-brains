import { z } from 'zod/v4';

export const landingSiteSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
  lat: z
    .number({ error: 'Szerokość geograficzna od -90 do 90' })
    .min(-90, 'Szerokość geograficzna od -90 do 90')
    .max(90, 'Szerokość geograficzna od -90 do 90'),
  lng: z
    .number({ error: 'Długość geograficzna od -180 do 180' })
    .min(-180, 'Długość geograficzna od -180 do 180')
    .max(180, 'Długość geograficzna od -180 do 180'),
});

export type LandingSiteFormData = z.infer<typeof landingSiteSchema>;
