import { z } from 'zod';

export const envSchema = z.object({
  APP_PORT: z.coerce.number().optional().default(3000),
  POSTGRES_USER: z.string().optional().default('calendly'),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string().optional().default('calendly'),
  POSTGRES_HOST: z.string().optional().default('localhost'),
  POSTGRES_PORT: z.coerce.number().optional().default(5432),
});

export type Env = z.infer<typeof envSchema>;
