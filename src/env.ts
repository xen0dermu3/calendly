import { z } from 'zod';

export const envSchema = z.object({
  APP_PORT: z.coerce.number().optional().default(3000),
});

export type Env = z.infer<typeof envSchema>;
