import { z } from 'zod';

export const battleSchema = z.object({
  battle_id: z.number().optional(),
  team_id1: z.number({
    required_error: 'Team ID 1 is required',
  }),
  team_id2: z.number({
    required_error: 'Team ID 2 is required',
  }),
  type_id: z.number({
    required_error: 'Type ID is required',
  }),
  date: z
    .date({
      required_error: 'Date is required',
    })
    .refine((value) => value > new Date(), {
      message: 'Date must be in the future',
    }),
  place_id: z.number({
    required_error: 'Place ID is required',
  }),
});
