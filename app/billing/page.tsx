"use client"

import { useMemo, useState } from "react"
import AppNav from "@/app/components/AppNav"
import { createClient } from "@/utils/supabase/client"

const PLANS = [
  { name: "Starter", docs: "5 documents / month", price: "$19.99", priceId: "price_STARTER_ID_HERE" },
  { name: "Pro", docs: "25 documents / month", price: "$49.99", priceId: "price_PRO_ID_HERE" },
  { name: "Business", docs: "75 documents / month", price: "$139.99", priceId: "price_BUSINESS_ID_HERE" },
  { name: "Unlimited", docs: "Unlimited documents / month", price: "$279.99", priceId: "price_UNLIMITED_ID_HERE" },
]

export default function BillingPage() {
  const supabase = useMemo(() => createClient(), [])
  const [loadingId, setLoadingId] = useState<string>("")
  const [error, setError] = useState("")

  const startCheckout = async (priceId: string) => {
    setError("")
    setLoadingId(priceId)

    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) {
      setError("Please log in first.")
      setLoadingId("")
      return
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ priceId }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.url) {
      setError(data?.error || "Checkout failed.")
      setLoadingId("")
      return
    }

    window.location.href = data.url
  }

  return (
    <>
      <AppNav />
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f8fafc, #ffffff)", paddingTop: 140, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h1 style={{ fontSize: 52, fontWeight: 950, color: "#0f172a", textAlign: "center" }}>
            Upgrade Your Plan
          </h1>
          <p style={{ marginTop: 14, textAlign: "center", color: "#64748b", fontSize: 18, fontWeight: 700 }}>
            Choose a subscription to unlock more uploads.
          </p>

          {error && (
            <div style={{ marginTop: 16, textAlign: "center", color: "#9f1239", fontWeight: 900 }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
            {PLANS.map((p) => (
              <div key={p.name} style={{ background: "white", borderRadius: 22, border: "1px solid #e2e8f0", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)", padding: 18 }}>
                <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>{p.name}</div>
                <div style={{ marginTop: 6, fontWeight: 800, color: "#334155" }}>{p.docs}</div>
                <div style={{ marginTop: 10, fontSize: 24, fontWeight: 950, color: "#2563eb" }}>{p.price}</div>

                <button
                  onClick={() => startCheckout(p.priceId)}
                  disabled={loadingId === p.priceId}
                  style={{
                    marginTop: 14,
                    width: "100%",
                    textAlign: "center",
                    padding: "12px 14px",
                    borderRadius: 14,
                    fontWeight: 950,
                    color: "white",
                    background: "linear-gradient(to right, #2563eb, #3b82f6)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 10px 26px rgba(59, 130, 246, 0.25)",
                    opacity: loadingId === p.priceId ? 0.7 : 1,
                  }}
                >
                  {loadingId === p.priceId ? "Redirecting..." : `Subscribe to ${p.name} →`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
