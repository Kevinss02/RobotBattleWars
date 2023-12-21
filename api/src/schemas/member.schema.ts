import { z } from 'zod';

export const memberSchema = z.object({
  dni: z
    .string({
      required_error: 'DNI is required',
    })
    .length(9, {
      message: 'DNI must be exactly 9 characters',
    })
    .refine((value) => /^[0-9]{8}[a-zA-Z]$/.test(value), {
      message: 'DNI must have 8 digits followed by a letter',
    }),

  fullname: z
    .string({
      required_error: 'Full name is required',
    })
    .min(2, {
      message: 'Full name must be at least 2 characters',
    })
    .max(100, {
      message: 'Full name must not exceed 100 characters',
    })
    .refine((value) => /^[\p{L}\p{M}'\s-]+$/u.test(value), {
      message: 'Invalid full name',
    }),

  email: z
    .string({
      required_error: 'Email is required',
    })
    .refine(
      (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value),
      {
        message: 'Invalid email',
      },
    ),

  is_captain: z.boolean().optional().default(false),

  team_id: z.number().optional(),

  active: z.boolean().optional().default(true),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, {
      message: 'Password must be at least 6 characters',
    })
    .max(100, {
      message: 'Password must not exceed 20 characters',
    }),
});

export const optionalMemberSchema = memberSchema.partial();
