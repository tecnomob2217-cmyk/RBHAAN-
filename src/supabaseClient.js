import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vqomsrrjmvtmnjattyvv.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ksck-MG74vCSg0cTzfinCg_F76CRq0m';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
