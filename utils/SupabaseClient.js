const { createClient } = require("@supabase/supabase-js");

//Har ikke opsat .env da dette blot er en eksempels app. :)

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://chhjmxvfeijaeqfbmnam.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoaGpteHZmZWlqYWVxZmJtbmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY1NTU4OTMxNywiZXhwIjoxOTcxMTY1MzE3fQ.w-atNvmAY6zRbbx40OQ3M1FeQGFkLdPWFZUcQAui5dk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
