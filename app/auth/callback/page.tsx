"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"

function CallbackInner() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = useMemo(() => createClient(), [])

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Finishing authentication…")

  useEffect(() => {
    const run = async () => {
      try {
        // Some links include error params
        const errorParam = params.get("error")
        const errorDescription = params.get("error_description")
        if (errorParam) {
          setStatus("error")
          setMessage(decodeURIComponent(errorDescription || errorParam))
          return
        }

        // ✅ Support BOTH formats:
        const code = params.get("code") // code exchange flow
        const token_hash = params.get("token_hash") // verifyOtp flow
        const type = params.get("type") as
          | "signup"
          | "recovery"
          | "invite"
          | "email_change"
          | null

        // Format A: ?code=
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            setStatus("error")
            setMessage(error.message || "Could not complete sign-in.")
            return
          }

          setStatus("success")
          setMessage("Account confirmed! Redirecting…")
          setTimeout(() => router.replace("/dashboard"), 400)
          return
        }

        // Format B: ?token_hash=...&type=signup
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          })

          if (error) {
            setStatus("error")
            setMessage(error.message || "Could not verify email link.")
            return
          }

          // After verifyOtp, a session may or may not exist depending on your settings.
          // We'll route to login and let them sign in, or you can route to dashboard if session exists.
          const { data } = await supabase.auth.getSession()

          setStatus("success")
          setMessage("Email verified! Redirecting…")

          setTimeout(() => {
            router.replace(data.session ? "/dashboard" : "/login")
          }, 400)
          return
        }

        // Neither format present
        setStatus("error")
        setMessage("Missing confirmation code. Please try the link again or log in.")
      } catch (e: any) {
        setStatus("error")
        setMessage(e?.message || "Unexpected error completing authentication.")
      }
    }

    run()
  }, [params, router, supabase])

  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: status === "error" ? "#dc2626" : status === "success" ? "#16a34a" : "#64748b",
          marginBottom: 18,
        }}
      >
        {message}
      </p>

      {status === "error" && (
        <div style={{ display: "grid", gap: 10, justifyContent: "center" }}>
          <PrimaryCtaButton onClick={() => router.push("/login")}>
            Go to Login →
          </PrimaryCtaButton>
          <a href="/signup" style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}>
            Need a new confirmation email? Sign up again →
          </a>
        </div>
      )}
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <PageShell title="Signing you in..." subtitle="Finishing authentication.">
      <Suspense fallback={<div style={{ textAlign: "center", color: "#64748b" }}>Loading…</div>}>
        <CallbackInner />
      </Suspense>
    </PageShell>
  )
}
