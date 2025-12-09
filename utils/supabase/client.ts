// utils/supabase/client.ts — WORKING VERSION
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase"

export const createClient = () => createBrowserSupabaseClient<Database>()
