// utils/supabase/client.ts — SIMPLE & WORKING VERSION
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const createClient = () => createClientComponentClient()
