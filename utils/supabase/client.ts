// utils/supabase/client.ts — SIMPLE & WORKING (basic supabase-js client)
import { createClient } from "@supabase/supabase-js": "^2.45.4"

export const createClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
