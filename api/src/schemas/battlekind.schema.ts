import { z } from 'zod';

export const battleKindSchema = z.object({
  type_id: z.number().optional(),
  rounds: z.number(
    {
      required_error: 'Rounds is required',
    }
  ).min(1,
    {
      message: 'Rounds must be at least 1',
    }
  ).max(30,
    {
      message: 'Rounds must not exceed 10',
    }
  ),
  time_per_round: z.number(
    {
      required_error: 'Time Per Round is required',
    }).min(1,
      {
        message: 'Time Per Round must be at least 1',
      }
      ).max(15,
        {
          message: 'Time Per Round must not exceed 15',
        }
      ),
  timeouts: z.number(
    {
      required_error: 'Timeouts is required',
    }
  ).min(1,
    {
      message: 'Timeouts must be at least 2',
    }
    ).max(10,
      {
        message: 'Timeouts must not exceed 5',     
      }
    ),
  spontaneous: z.boolean(
    {
      required_error: 'Spontaneous is required either true or false',
    }
  ),
});