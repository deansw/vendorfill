"use client"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import PageShell from "@/components/PageShell"

export default function AuthCallback() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const run = async () => {
      const code = params.get("code")
      if (!code) {
        router.replace("/login")
        return
      }

      // Works in newer supabase-js versions:
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        router.replace("/login")
        return
      }

      router.replace("/dashboard")
    }

    run()
  }, [params, router, supabase])

  return (
    <PageShell title="Signing you in..." subtitle="Finishing authentication.">
      <div />
    </PageShell>
  )
}
