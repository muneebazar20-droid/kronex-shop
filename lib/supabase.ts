import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://peayvbisdvtzvyxqxuaw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0_c1f7B8y_3j-Mf1SEKbEA_IjRlSFtb';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
