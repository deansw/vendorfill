"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"
import { createClient } from "@/utils/supabase/client"

function ResetInner() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const params = useSearchParams()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  // Optional: show message if they arrived here correctly
  useEffect(() => {
    // Some providers include type=recovery, etc. Not required, but useful.
    const type = params.get("type")
    if (type === "recovery") {
      setMessage("Set a new password below.")
    }
  }, [params])

  const handleReset = async () => {
    setError("")
    setMessage("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage("✅ Password updated! Redirecting to login…")
    setTimeout(() => router.push("/login"), 700)
    setLoading(false)
  }

  return (
    <PageShell title="Reset Password" subtitle="Choose a new password for your account.">
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
            New Password
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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

          <label style={{ fontSize: 18, fontWeight: 800, color: "#334155" }}>
            Confirm Password
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
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

          <PrimaryCtaButton onClick={handleReset} disabled={loading}>
            {loading ? "Updating..." : "Update Password →"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  )
}
