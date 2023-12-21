import { z } from 'zod';

export const hitterSchema = z.object({
  arm_material: z
    .string({
      required_error: 'Arm Material is required',
    })
    .refine((value) => /^[a-zA-Z0-9 ]+$/.test(value)),

  joint_count: z
    .number({
      required_error: 'Joint Count is required',
    })
    .min(1, {
      message: 'Joint Count must be at least 1',
    })
    .max(6, {
      message: 'Joint Count must not exceed 5',
    }),

  hitting_surface: z
    .number({
      required_error: 'Hitting Surface is required',
    })
    .min(1, {
      message: 'Hitting Surface must be at least 1',
    })
    .max(100, {
      message: 'Hitting Surface must not exceed 5',
    }),

  hitting_force: z
    .number({
      required_error: 'Hitting Force is required',
    })
    .min(1, {
      message: 'Hitting Force must be at least 1',
    })
    .max(2000, {
      message: 'Hitting Force must not exceed 5',
    }),
});

export const optionalHitterSchema = hitterSchema.partial();
