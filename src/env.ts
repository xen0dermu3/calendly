import { z } from 'zod';

export const envSchema = z.object({
  APP_PORT: z.coerce.number().optional().default(3000),
  POSTGRES_USER: z.string().optional().default('calendly'),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string().optional().default('calendly'),
  POSTGRES_HOST: z.string().optional().default('localhost'),
  POSTGRES_PORT: z.coerce.number().optional().default(5432),
  NODE_ENV: z.enum(['dev', 'prod']).optional().default('dev'),
  REDIS_HOST: z.string().optional().default('localhost'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_PASSWORD: z.string(),
});

export type Env = z.infer<typeof envSchema>;
