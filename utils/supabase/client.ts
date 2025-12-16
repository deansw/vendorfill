// utils/supabase/client.ts — FIXED & WORKING
import { createClient } from "@supabase/supabase-js"

export const createClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
