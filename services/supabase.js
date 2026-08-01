import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nyyljcdrmbdavamgcydw.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eWxqY2RybWJkYXZhbWdjeWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNTQ4NTUsImV4cCI6MjA5OTczMDg1NX0.QtX1TDqpFfmK0JbdzYaMlNb7QVaVcOBKSnCap5oUKas";


export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);