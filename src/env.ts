import { z } from 'zod';

const envSchema = z.object({
  API_BASE_URL: z.string().url().min(1),
  AUTH_REDIRECT_URL: z.string().url().min(1),
  DATABASE_URL: z.string().url().min(1),
  DATABASE_DIALECT: z.string().min(1),
  DATABASE_SCHEMA_PATH: z.string().min(1),
  DATABASE_OUTPUT_PATH: z.string().min(1),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1)
});

export const env = envSchema.parse(process.env);
