"use client"
import { useMemo, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"

export default function Signup() {
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const canSubmit = useMemo(() => {
    if (!email.trim()) return false
    if (!password) return false
    if (password.length < 6) return false
    if (password !== confirmPassword) return false
    return true
  }, [email, password, confirmPassword])

  const handleSignup = async () => {
    setError("")
    setMessage("")

    const cleanEmail = email.trim()

    if (!cleanEmail || !password) {
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
      email: cleanEmail,
      password,
      options: {
        // After confirming the email, send them to login (more predictable than dashboard).
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (error) {
      const msg = error.message || "Signup failed."

      // Common case: user already exists (Supabase wording can vary by config)
      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered")) {
        setError("That email is already registered. Try logging in instead.")
      } else {
        setError(msg)
      }

      setLoading(false)
      return
    }

    // If email confirmations are ON, you usually won't get an active session immediately.
    // Give the user a crisp next step.
    if (!data.user) {
      setMessage("Account created! Check your email to confirm, then come back and log in.")
    } else {
      setMessage("Account created! You can log in now.")
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

          {/* Inline validation hint (optional but helpful) */}
          {password && password.length < 6 && (
            <p style={{ color: "#b45309", fontWeight: 700, textAlign: "center" }}>
              Password must be at least 6 characters.
            </p>
          )}
          {confirmPassword && password !== confirmPassword && (
            <p style={{ color: "#b45309", fontWeight: 700, textAlign: "center" }}>
              Passwords do not match.
            </p>
          )}

          {error && (
            <p style={{ color: "#dc2626", fontWeight: 800, textAlign: "center" }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: "#16a34a", fontWeight: 800, textAlign: "center" }}>
              {message}
            </p>
          )}

          <div style={{ marginTop: 6 }}>
            <PrimaryCtaButton onClick={handleSignup} disabled={loading || !canSubmit}>
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

