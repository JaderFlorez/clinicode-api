import dotenv from 'dotenv';

dotenv.config();


export const configuracion = {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_KEY!,
};