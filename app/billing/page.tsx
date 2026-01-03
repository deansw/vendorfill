"use client"

import { useEffect, useMemo, useState } from "react"
import AppNav from "@/components/AppNav"
import { createClient } from "@/utils/supabase/client"

const PLANS = [
  { key: "starter", name: "Starter", docs: "5 documents / month", price: "$19.99", priceId: "price_1SaN5TLUnMjiPKi9r0UnyAYM" },
  { key: "pro", name: "Pro", docs: "25 documents / month", price: "$49.99", priceId: "price_1SlKH6LUnMjiPKi9ozcPR91i" },
  { key: "business", name: "Business", docs: "75 documents / month", price: "$139.99", priceId: "price_1SlKHdLUnMjiPKi9QaqXhaEZ" },
  { key: "unlimited", name: "Unlimited", docs: "Unlimited documents / month", price: "$279.99", priceId: "price_1SlKHvLUnMjiPKi9RacDSNMf" },
] as const

const RANK: Record<string, number> = { free: 0, starter: 1, pro: 2, business: 3, unlimited: 4 }

export default function BillingPage() {
  const supabase = useMemo(() => createClient(), [])
  const [loadingId, setLoadingId] = useState("")
  const [error, setError] = useState("")
  const [currentPlan, setCurrentPlan] = useState<string>("free")
  const [hasCustomer, setHasCustomer] = useState<boolean>(false)

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) return

      const { data: ent } = await supabase
        .from("user_entitlements")
        .select("plan,stripe_customer_id")
        .single()

      if (ent?.plan) setCurrentPlan(ent.plan)
      setHasCustomer(!!ent?.stripe_customer_id)
    }

    load()
  }, [supabase])

  const startCheckout = async (priceId: string) => {
    setError("")
    setLoadingId(priceId)

    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) {
      setError("You must be logged in to subscribe.")
      setLoadingId("")
      return
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ priceId }),
    })

    const payload = await res.json().catch(() => ({}))

    if (!res.ok || !payload?.url) {
      setError(payload?.error || `Checkout failed (status ${res.status}).`)
      setLoadingId("")
      return
    }

    window.location.href = payload.url
  }

  const openPortal = async () => {
    setError("")
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) {
      setError("Please log in first.")
      return
    }

    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })

    const payload = await res.json().catch(() => ({}))

    if (!res.ok || !payload?.url) {
      setError(payload?.error || `Could not open billing portal (status ${res.status}).`)
      return
    }

    window.location.href = payload.url
  }

  const currentRank = RANK[currentPlan] ?? 0

  return (
    <>
      <AppNav />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
          paddingTop: 140,
          paddingBottom: 80,
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h1 style={{ fontSize: 52, fontWeight: 950, color: "#0f172a", textAlign: "center" }}>
            Billing
          </h1>

          <p style={{ marginTop: 14, textAlign: "center", color: "#64748b", fontSize: 18, fontWeight: 800 }}>
            Current plan: <span style={{ color: "#0f172a" }}>{currentPlan}</span>
          </p>

          {(currentPlan !== "free" || hasCustomer) && (
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button
                onClick={openPortal}
                style={{
                  padding: "12px 18px",
                  borderRadius: 14,
                  fontWeight: 950,
                  border: "1px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer",
                  boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
                }}
              >
                Manage Billing →
              </button>
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 16,
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#9f1239",
                padding: "12px 14px",
                borderRadius: 14,
                fontWeight: 900,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 16,
            }}
          >
            {PLANS.map((p) => {
              const planRank = RANK[p.key]
              const isLowerThanCurrent = currentRank > 0 && planRank < currentRank
              const disabled = isLowerThanCurrent || loadingId === p.priceId

              return (
                <div
                  key={p.key}
                  style={{
                    background: "white",
                    borderRadius: 22,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
                    padding: 18,
                    opacity: isLowerThanCurrent ? 0.6 : 1,
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>{p.name}</div>
                  <div style={{ marginTop: 6, fontWeight: 800, color: "#334155" }}>{p.docs}</div>
                  <div style={{ marginTop: 10, fontSize: 24, fontWeight: 950, color: "#2563eb" }}>{p.price}</div>

                  {isLowerThanCurrent ? (
                    <div style={{ marginTop: 14, fontWeight: 900, color: "#64748b" }}>
                      You’re already on a higher plan.
                    </div>
                  ) : (
                    <button
                      onClick={() => startCheckout(p.priceId)}
                      disabled={disabled}
                      style={{
                        marginTop: 14,
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 14,
                        fontWeight: 950,
                        color: "white",
                        background: "linear-gradient(to right, #2563eb, #3b82f6)",
                        border: "none",
                        cursor: disabled ? "not-allowed" : "pointer",
                        boxShadow: "0 10px 26px rgba(59, 130, 246, 0.25)",
                        opacity: disabled ? 0.7 : 1,
                      }}
                    >
                      {loadingId === p.priceId ? "Redirecting..." : `Subscribe to ${p.name} →`}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
