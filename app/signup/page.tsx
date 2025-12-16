"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"

export default function Signup() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleSignup = async () => {
    setError("")
    setMessage("")

    if (!email || !password) {
      setError("Please enter an email and password.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // After clicking the confirmation email (if enabled),
        // Supabase can redirect here.
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // If email confirmations are ON, user may be null until confirmed.
    // Either way, we show a helpful success message.
    setMessage(
      data.user
        ? "Account created! Redirecting..."
        : "Account created! Check your email to confirm your account."
    )

    // If confirmations are off, user is created immediately:
    if (data.user) {
      router.push("/dashboard")
    }

    setLoading(false)
  }

  return (
    <PageShell title="Sign Up" subtitle="Create your account to start uploading vendor packets.">
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
        <div style={{ display: "grid", gap: 16 }}>
          <label style={{ fontSize: 18, fontWeight: 800, color: "#334155" }}>
            Email
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

          <label style={{ fontSize: 18, fontWeight: 800, color: "#334155" }}>
            Password
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <p style={{ color: "#dc2626", fontWeight: 700, textAlign: "center" }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: "#16a34a", fontWeight: 700, textAlign: "center" }}>
              {message}
            </p>
          )}

          <div style={{ marginTop: 6 }}>
            <PrimaryCtaButton onClick={handleSignup} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </PrimaryCtaButton>
          </div>

          <div style={{ textAlign: "center", color: "#64748b", fontSize: 16 }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Login
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
