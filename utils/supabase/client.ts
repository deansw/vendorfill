// utils/supabase/client.ts — SIMPLE & WORKING (no SSR wrapper)
import { createClient } from "@supabase/supabase-js"

export const createClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
