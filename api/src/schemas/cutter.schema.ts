import { z } from 'zod';

export const cutterSchema = z.object({
  rpm: z
    .number({
      required_error: 'rpm is required',
    })
    .min(500, {
      message: 'RPM must be at least 500, too weak',
    })
    .max(5000, {
      message: 'RPM must not exceed 5000, too powerful',
    }),
  saw_material: z
    .string({
      required_error: 'Saw Material is required',
    })
    .refine((value) => /^[a-zA-Z0-9 ]+$/.test(value))
    .transform((data) => data.replace(/^(.)/, (match) => match.toUpperCase())),
  saw_count: z
    .number({
      required_error: 'Saw Count is required',
    })
    .min(1, {
      message: 'Saw Count must be at least 1',
    })
    .max(10, {
      message: 'Saw Count must not exceed 5',
    }),
});

export const optionalCutterSchema = cutterSchema.partial();
