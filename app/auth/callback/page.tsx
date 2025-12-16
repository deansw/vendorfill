"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import PageShell from "@/components/PageShell"

function CallbackInner() {
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

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("exchangeCodeForSession error:", error)
        router.replace("/login")
        return
      }

      router.replace("/dashboard")
    }

    run()
  }, [params, router, supabase])

  return null
}

export default function AuthCallbackPage() {
  return (
    <PageShell title="Signing you in..." subtitle="Finishing authentication.">
      <Suspense fallback={null}>
        <CallbackInner />
      </Suspense>
    </PageShell>
  )
}
