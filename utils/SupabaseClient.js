const { createClient } = require("@supabase/supabase-js");

//Har ikke opsat .env da dette blot er en eksempels app. :)

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://chhjmxvfeijaeqfbmnam.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaGpteHZmZWlqYWVxZmJtbmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU1OTA1MjMsImV4cCI6MTk3MTE2NjUyM30.Pkr3gzIy5a7LhsBKvqM-Iy5-8_hSpvhzgOopwAmsNuI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
