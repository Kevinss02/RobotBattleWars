import { z } from 'zod';

export const flamethrowerSchema = z.object({
  fuel: z
    .string({
      required_error: 'Fuel is required',
    })
    .refine((value) => /^[a-zA-Z0-9 ]+$/.test(value)),
  max_temperature: z
    .number({
      required_error: 'Max Temperature is required',
    })
    .min(800, {
      message: 'Max Temperature must be at least 100',
    })
    .max(2000, {
      message: 'Max Temperature must not exceed 500',
    }),
  spitfire_count: z
    .number({
      required_error: 'Spitfire Count is required',
    })
    .min(1, {
      message: 'Spitfire Count must be at least 1',
    })
    .max(5, {
      message: 'Spitfire Count must not exceed 5',
    }),
});

export const optionalFlamethrowerSchema = flamethrowerSchema.partial();
