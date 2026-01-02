"use client"

import { useMemo, useState } from "react"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"
import { createClient } from "@/utils/supabase/client"

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createClient(), [])

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleSend = async () => {
    setError("")
    setMessage("")

    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setError("Please enter your email.")
      return
    }

    setLoading(true)

    // ✅ Always send them back to your reset page on the canonical domain
    const RESET_REDIRECT_TO = "https://www.vendorfill.com/reset-password"

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: RESET_REDIRECT_TO,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage("✅ Check your email for a password reset link.")
    setLoading(false)
  }

  return (
    <PageShell title="Forgot Password" subtitle="We’ll email you a link to reset your password.">
      <div
        style={{
          background: "white",
          borderRadius: 24,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          padding: 42,
          maxWidth: 520,
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        {message && (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #bbf7d0",
              color: "#166534",
              padding: "14px 16px",
              borderRadius: 14,
              fontWeight: 800,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#9f1239",
              padding: "14px 16px",
              borderRadius: 14,
              fontWeight: 800,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "grid", gap: 16 }}>
          <label style={{ fontSize: 18, fontWeight: 800, color: "#334155" }}>
            Email
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              style={{
                width: "100%",
                marginTop: 8,
                padding: "18px",
                borderRadius: 14,
                border: "2px solid #e2e8f0",
                fontSize: 18,
                outline: "none",
              }}
            />
          </label>

          <PrimaryCtaButton onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link →"}
          </PrimaryCtaButton>

          <div style={{ textAlign: "center", color: "#64748b", fontSize: 16 }}>
            <a href="/login" style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}>
              Back to Login →
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
