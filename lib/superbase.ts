import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// ... resto del file con URL e KEY

const supabaseUrl = 'https://bbmjslukagnkdqttntiw.supabase.co';
const supabaseAnonKey = 'sb_publishable_lnOHbrwhGfT0Pkjmgvs9UA_0EmKqlqb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);