import { z } from 'zod/v4';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const userSchema = z.object({
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
  role: z.enum(['ADMINISTRATOR', 'PLANNER', 'SUPERVISOR', 'PILOT']),
  password: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
