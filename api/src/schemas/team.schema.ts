import { z } from 'zod';

export const teamSchema = z.object({
  team_id: z.number().optional(),

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
    .refine((value) => /^[a-zA-Z0-9 ]+$/.test(value), {
      message: 'Invalid name',
    }),

  robot_id: z.number().optional(),
});

export const optionalTeamSchema = teamSchema.partial();
