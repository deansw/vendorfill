"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import PageShell from "@/components/PageShell"

function CallbackInner() {
  const router = useRouter()
  const params = useSearchParams()

  // ✅ Create the client once (prevents effect loops / re-renders issues)
  const supabase = useMemo(() => createClient(), [])

  const [status, setStatus] = useState<"loading" | "error" | "success">("loading")
  const [message, setMessage] = useState("Finishing authentication…")

  useEffect(() => {
    const run = async () => {
      try {
        const errorParam = params.get("error")
        const errorDescription = params.get("error_description")
        const code = params.get("code")

        if (errorParam) {
          setStatus("error")
          setMessage(decodeURIComponent(errorDescription || errorParam))
          return
        }

        if (!code) {
          setStatus("error")
          setMessage("Missing confirmation code. Please try the link again or log in.")
          return
        }

        setStatus("loading")
        setMessage("Confirming your account…")

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error("exchangeCodeForSession error:", error)
          setStatus("error")
          setMessage(error.message || "Could not complete sign-in. Please try logging in.")
          return
        }

        setStatus("success")
        setMessage("Account confirmed! Redirecting to your dashboard…")

        setTimeout(() => {
          router.replace("/dashboard")
        }, 600)
      } catch (e: any) {
        setStatus("error")
        setMessage(e?.message || "Unexpected error during authentication.")
      }
    }

    run()
  }, [params, router, supabase])

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", paddingTop: 10 }}>
        <p style={{ fontSize: 20, color: "#64748b" }}>{message}</p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", paddingTop: 10 }}>
        <p style={{ fontSize: 20, color: "#16a34a", fontWeight: 800 }}>{message}</p>
      </div>
    )
  }

  // error
  return (
    <div style={{ textAlign: "center", paddingTop: 10 }}>
      <p style={{ fontSize: 20, color: "#dc2626", fontWeight: 800, marginBottom: 18 }}>{message}</p>

      <div style={{ display: "grid", gap: 12, justifyContent: "center" }}>
        <a
          href="/login"
          style={{
            display: "inline-block",
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            color: "white",
            padding: "18px 36px",
            borderRadius: 16,
            fontSize: 22,
            fontWeight: 800,
            textDecoration: "none",
            boxShadow: "0 12px 30px rgba(59, 130, 246, 0.45)",
          }}
        >
          Go to Login →
        </a>

        <a
          href="/signup"
          style={{
            display: "inline-block",
            color: "#2563eb",
            fontWeight: 800,
            textDecoration: "none",
            fontSize: 18,
          }}
        >
          Need a new confirmation email? Sign up again →
        </a>
      </div>
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
