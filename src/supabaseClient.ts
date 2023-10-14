import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
