// app/login/page.tsx — FIXED: NO INVALID OPTIONS
"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

const supabase = createClient()

export default function Login() {
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
      setError(error.message)
      if (error.message.includes("2FA")) {
        // Supabase will prompt for 2FA automatically in some cases
        // For manual TOTP, we'd use verifyOtp — but for now, show message
        setError("2FA required — check your authenticator app")
      }
    } else if (data.user) {
      router.push("/dashboard")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
        <h1 className="text-5xl font-black text-center mb-8">Login</h1>
        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
          />
          {error && <p className="text-red-600 text-center">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
          <p className="text-center text-gray-600">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </p>
          <p className="text-center text-gray-600">
            No account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  )
}
