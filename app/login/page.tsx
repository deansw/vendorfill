"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"

export default function Login() {
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.toLowerCase().includes("2fa")) {
        setError("2FA required — check your authenticator app.")
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    if (data.user) router.push("/dashboard")
    setLoading(false)
  }

  return (
    <PageShell title="Login" subtitle="Access your dashboard and uploads.">
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
              placeholder="••••••••"
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

          {error && (
            <p style={{ color: "#dc2626", fontWeight: 700, textAlign: "center" }}>
              {error}
            </p>
          )}

          <div style={{ marginTop: 6 }}>
            <PrimaryCtaButton onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </PrimaryCtaButton>
          </div>

          <div style={{ marginTop: 10, textAlign: "center", color: "#64748b", fontSize: 16 }}>
            <a href="/forgot-password" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>

          <div style={{ textAlign: "center", color: "#64748b", fontSize: 16 }}>
            No account?{" "}
            <a href="/signup" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Sign up
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
