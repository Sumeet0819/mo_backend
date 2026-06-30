import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Export a dummy client if keys are not provided so the app doesn't crash immediately
export const supabase = (env.SUPABASE_URL && env.SUPABASE_KEY)
  ? createClient(env.SUPABASE_URL, env.SUPABASE_KEY)
  : null;
