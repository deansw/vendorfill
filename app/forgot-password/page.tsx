"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"

export default function ForgotPassword() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleReset = async () => {
    setLoading(true)
    setError("")
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Password reset email sent. Check your inbox.")
    }

    setLoading(false)
  }

  return (
    <PageShell title="Forgot Password" subtitle="We'll email you a secure reset link.">
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
        <label style={{ fontSize: 18, fontWeight: 800, color: "#334155" }}>
          Email address
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {error && (
          <p style={{ marginTop: 12, color: "#dc2626", fontWeight: 700, textAlign: "center" }}>
            {error}
          </p>
        )}

        {message && (
          <p style={{ marginTop: 12, color: "#16a34a", fontWeight: 700, textAlign: "center" }}>
            {message}
          </p>
        )}

        <div style={{ marginTop: 24 }}>
          <PrimaryCtaButton onClick={handleReset} disabled={loading || !email}>
            {loading ? "Sending..." : "Send Reset Link →"}
          </PrimaryCtaButton>
        </div>
      </div>
    </PageShell>
  )
}

