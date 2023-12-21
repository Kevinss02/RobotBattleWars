import { z } from 'zod';

import { ROBOT_CATEGORY } from '../config.js';

export const robotSchema = z.object({
  robot_id: z.number().optional(),

  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, {
      message: 'Name must be at least 2 characters',
    })
    .max(100, {
      message: 'Name must not exceed 100 characters',
    })
    .refine((value) => /^[a-zA-Z0-9 ]+$/.test(value)),

  mobility: z
    .number({
      required_error: 'Mobility is required',
    })
    .min(1)
    .max(5),

  power: z
    .number({
      required_error: 'Power is required',
    })
    .min(1)
    .max(5),

  coating: z
    .number({
      required_error: 'Coating is required',
    })
    .min(1)
    .max(5),

  cost: z
    .number({
      required_error: 'Cost is required',
    })
    .min(0, {
      message: 'Cost must be a non-negative number',
    }),

  category: z.enum(ROBOT_CATEGORY),
});

export const optionalRobotSchema = robotSchema.partial();
