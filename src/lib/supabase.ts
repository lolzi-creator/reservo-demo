import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kkiyhdyuqpyvspwscaci.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtraXloZHl1cXB5dnNwd3NjYWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjE4OTksImV4cCI6MjA3MzYzNzg5OX0.h9_gg8tohs2U4SdqDYinX-fvNd7bjRhmGS4dWvwGW74';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
