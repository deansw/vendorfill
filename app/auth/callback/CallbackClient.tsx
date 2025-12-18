"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function CallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClient(), [])

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Finishing sign-in…")

  useEffect(() => {
    const run = async () => {
      try {
        const code = searchParams.get("code")
        const error = searchParams.get("error")
        const errorDescription = searchParams.get("error_description")

        if (error) {
          setStatus("error")
          setMessage(decodeURIComponent(errorDescription || error))
          return
        }

        if (!code) {
          setStatus("error")
          setMessage("Missing confirmation code. Please try the link again or request a new email.")
          return
        }

        setStatus("loading")
        setMessage("Confirming your account…")

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          setStatus("error")
          setMessage(exchangeError.message || "Could not complete sign-in.")
          return
        }

        setStatus("success")
        setMessage("Account confirmed! Redirecting to your dashboard…")

        // Give a tiny beat so the success message shows
        setTimeout(() => {
          router.replace("/dashboard")
        }, 600)
      } catch (e: any) {
        setStatus("error")
        setMessage(e?.message || "Unexpected error completing sign-in.")
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
        paddingTop: "160px",
        paddingBottom: "120px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: 54, fontWeight: 900, color: "#0f172a", marginBottom: 18 }}>
          {status === "success" ? "You’re all set!" : status === "error" ? "Link issue" : "Confirming…"}
        </h1>

        <p style={{ fontSize: 22, color: "#64748b", marginBottom: 40 }}>{message}</p>

        {status === "error" && (
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
        )}
      </div>
    </div>
  )
}
