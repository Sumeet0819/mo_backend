import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_KEY: z.string().optional(),
  DOWNLOAD_DIR: z.string().default('./downloads'),
  TEMP_DIR: z.string().default('./temp'),
  MAX_CONCURRENT_DOWNLOADS: z.string().default('3'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
