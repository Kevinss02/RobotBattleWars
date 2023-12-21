import { z } from 'zod';

export const placeSchema = z.object({
  place_id: z.number(),
  name: z
    .string({
      required_error: 'Name is required',
    })
    .refine((value) => /^[a-zA-Z0-9 ]+$/.test(value)),
  location: z
    .string({
      required_error: 'Location is required',
    })
    .refine((value) => /^[a-zA-Z0-9 ]+$/.test(value)),
  capacity: z
    .number()
    .min(1, {
      message: 'Capacity must be at least 1',
    })
    .refine((value) => value > 0, {
      message: 'Capacity must be a positive number',
    }),
});
