import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mrapgmwixpitoiqrnsav.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYXBnbXdpeHBpdG9pcXJuc2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNzEzOTYsImV4cCI6MjA1Njc0NzM5Nn0.n4kwfCz9g9hMhBifEed4qRMD9uWEUxuZlwxJ26Z8iAU",
)

