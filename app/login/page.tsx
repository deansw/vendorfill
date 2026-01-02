"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"

function LoginInner() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const params = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  // ✅ Success banner after email confirmation
  useEffect(() => {
    if (params.get("confirmed") === "1") {
      setNotice("✅ Email verified successfully. You can log in now.")
    }
  }, [params])

  const handleLogin = async () => {
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push("/dashboard")
    } else {
      setError("Login failed. Please try again.")
    }

    setLoading(false)
  }

  return (
    <PageShell title="Login" subtitle="Sign in to continue to your dashboard.">
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
        {notice && (
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
            {notice}
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

          <label style={{ fontSize: 18, fontWeight: 800, color: "#334155" }}>
            Password
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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

          <PrimaryCtaButton onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </PrimaryCtaButton>

          {/* Forgot password */}
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <a
              href="/forgot-password"
              style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}
            >
              Forgot password?
            </a>
          </div>

          {/* Signup */}
          <div style={{ textAlign: "center", color: "#64748b", fontSize: 16 }}>
            No account?{" "}
            <a
              href="/signup"
              style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  )
}
