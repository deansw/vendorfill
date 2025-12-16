import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const supabase = createClient()

  const code = searchParams.code

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // If user just confirmed email → auto-login → dashboard
  redirect("/dashboard")
}
