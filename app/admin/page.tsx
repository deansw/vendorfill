"use client"

import { useEffect, useMemo, useState } from "react"
import AppNav from "@/app/components/AppNav"
import { createClient } from "@/utils/supabase/client"

export default function AdminPage() {
  const supabase = useMemo(() => createClient(), [])
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setError("")
    setLoading(true)

    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) {
      setError("Please log in as an admin.")
      setLoading(false)
      return
    }

    const res = await fetch("/api/admin/metrics", {
      headers: { Authorization: `Bearer ${token}` },
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(json?.error || `Failed (status ${res.status})`)
      setLoading(false)
      return
    }

    setData(json)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <AppNav />
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f8fafc, #ffffff)", paddingTop: 140, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h1 style={{ fontSize: 52, fontWeight: 950, color: "#0f172a", textAlign: "center" }}>
            Admin Dashboard
          </h1>

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button
              onClick={load}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "white",
                fontWeight: 900,
                cursor: "pointer",
                boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
              }}
            >
              Refresh →
            </button>
          </div>

          {loading && (
            <p style={{ marginTop: 18, textAlign: "center", color: "#64748b", fontWeight: 800 }}>
              Loading…
            </p>
          )}

          {error && (
            <div style={{ marginTop: 18, background: "#fff1f2", border: "1px solid #fecdd3", color: "#9f1239", padding: "12px 14px", borderRadius: 14, fontWeight: 900, textAlign: "center" }}>
              {error}
            </div>
          )}

          {data && (
            <>
              <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
                <Card title="Period" value={data.period} />
                <Card title="Total Users" value={String(data.totalUsers)} />
                <Card title="Active Subscriptions" value={String(data.activeSubscriptions)} />
                <Card title="Uploads This Period" value={String(data.uploadsThisPeriod)} />
                <Card title="Stripe Revenue (month)" value={data.stripeRevenueThisMonth == null ? "—" : `$${data.stripeRevenueThisMonth.toFixed(2)}`} />
              </div>

              <div style={{ marginTop: 22, background: "white", borderRadius: 22, border: "1px solid #e2e8f0", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)", padding: 18 }}>
                <h2 style={{ fontSize: 22, fontWeight: 950, marginBottom: 12, color: "#0f172a" }}>
                  Top Users (Uploads This Period)
                </h2>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", color: "#64748b" }}>
                        <th style={{ padding: 10, borderBottom: "1px solid #e2e8f0" }}>User ID</th>
                        <th style={{ padding: 10, borderBottom: "1px solid #e2e8f0" }}>Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.topUsers || []).map((r: any) => (
                        <tr key={r.user_id}>
                          <td style={{ padding: 10, borderBottom: "1px solid #f1f5f9", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                            {r.user_id}
                          </td>
                          <td style={{ padding: 10, borderBottom: "1px solid #f1f5f9", fontWeight: 900 }}>
                            {r.used_count}
                          </td>
                        </tr>
                      ))}
                      {(data.topUsers || []).length === 0 && (
                        <tr>
                          <td style={{ padding: 10, color: "#64748b" }} colSpan={2}>
                            No usage yet for this period.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ background: "white", borderRadius: 22, border: "1px solid #e2e8f0", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)", padding: 18 }}>
      <div style={{ color: "#64748b", fontWeight: 900 }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 28, fontWeight: 950, color: "#0f172a" }}>{value}</div>
    </div>
  )
}
