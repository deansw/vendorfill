"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"

export default function Signup() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    password === confirmPassword

  const handleSignup = async () => {
    setError("")
    setMessage("")
    setSuccess(false)

    const cleanEmail = email.trim()

    if (!cleanEmail) return setError("Please enter an email.")
    if (password.length < 6) return setError("Password must be at least 6 characters.")
    if (password !== confirmPassword) return setError("Passwords do not match.")

    setLoading(true)

    // ✅ Always use canonical domain (no redirects)
    const SITE_URL = "https://www.vendorfill.com"

    // ✅ Redirect users to Login after they click the email link
    const EMAIL_REDIRECT_TO = `${SITE_URL}/login?confirmed=1`

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: EMAIL_REDIRECT_TO,
      },
    })

    if (error) {
      console.error("Supabase signUp error:", error)

      const pretty =
        (error as any)?.message ||
        (error as any)?.error_description ||
        JSON.stringify(error, Object.getOwnPropertyNames(error)) ||
        String(error)

      setError(pretty.toLowerCase().includes("already")
        ? "That email is already registered. Try logging in instead."
        : pretty
      )

      setLoading(false)
      return
    }

    setSuccess(true)

    // With confirmations ON, session usually null until confirmed
    const hasSession = !!data.session
    setMessage(
      hasSession
        ? "Account created! You can log in now."
        : "Account created! Check your email to confirm your account. After confirming, you’ll be sent to the login page."
    )

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
        {success ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#16a34a", fontSize: 18, fontWeight: 800, marginBottom: 24 }}>
              {message}
            </p>

            <PrimaryCtaButton onClick={() => router.push("/login")}>
              Go to Login →
            </PrimaryCtaButton>
          </div>
        ) : (
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

            <label style={{ fontSize: 18, fontWeight: 800, color: "#334155" }}>
              Password
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
                placeholder="Re-enter password"
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

            {error && (
              <p style={{ color: "#dc2626", fontWeight: 800, textAlign: "center" }}>{error}</p>
            )}

            <PrimaryCtaButton onClick={handleSignup} disabled={loading || !canSubmit}>
              {loading ? "Creating account..." : "Create Account →"}
            </PrimaryCtaButton>

            <div style={{ textAlign: "center", color: "#64748b", fontSize: 16 }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
                Login
              </a>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}
