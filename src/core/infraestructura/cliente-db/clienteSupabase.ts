import { createClient } from '@supabase/supabase-js';
import { configuracion } from '../../../common/configuracion';

const { supabaseUrl, supabaseKey } = configuracion;

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);