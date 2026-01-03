"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/utils/supabase/client"

function utcPeriodKey() {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

type UsageState = {
  loading: boolean
  signedIn: boolean
  freeAvailable: boolean
  plan: string
  monthlyLimit: number
  usedThisPeriod: number
  remainingThisPeriod: number | null // null for unlimited/unknown
}

export default function AppNav() {
  const supabase = useMemo(() => createClient(), [])
  const [usage, setUsage] = useState<UsageState>({
    loading: true,
    signedIn: false,
    freeAvailable: false,
    plan: "free",
    monthlyLimit: 0,
    usedThisPeriod: 0,
    remainingThisPeriod: 0,
  })

  useEffect(() => {
    const run = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData.session
      if (!session) {
        setUsage((p) => ({ ...p, loading: false, signedIn: false }))
        return
      }

      const period = utcPeriodKey()

      const { data: ent } = await supabase
        .from("user_entitlements")
        .select("plan, monthly_limit, free_used")
        .single()

      // If usage row doesn't exist yet this month, treat as 0 used
      const { data: useRow } = await supabase
        .from("user_usage")
        .select("used_count")
        .eq("period", period)
        .maybeSingle()

      const plan = ent?.plan ?? "free"
      const monthlyLimit = Number(ent?.monthly_limit ?? 0)
      const freeAvailable = ent ? !ent.free_used : true
      const usedThisPeriod = Number(useRow?.used_count ?? 0)

      let remainingThisPeriod: number | null = null
      if (monthlyLimit === -1) remainingThisPeriod = null
      else remainingThisPeriod = Math.max(0, monthlyLimit - usedThisPeriod)

      setUsage({
        loading: false,
        signedIn: true,
        freeAvailable,
        plan,
        monthlyLimit,
        usedThisPeriod,
        remainingThisPeriod,
      })
    }

    run()
  }, [supabase])

  const badgeText = (() => {
    if (usage.loading) return "Loading…"
    if (!usage.signedIn) return "Not signed in"
    if (usage.freeAvailable) return "🎁 1 free upload"
    if (usage.monthlyLimit === -1) return "♾️ Unlimited"
    if (usage.monthlyLimit <= 0) return "0 remaining"
    return `${usage.remainingThisPeriod ?? 0} remaining`
  })()

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/dashboard"
          style={{
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: "-0.02em",
            color: "#0f172a",
            textDecoration: "none",
          }}
        >
          VendorFill
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/upload" style={{ color: "#334155", fontWeight: 800, textDecoration: "none" }}>
            Upload
          </Link>
          <Link href="/profile" style={{ color: "#334155", fontWeight: 800, textDecoration: "none" }}>
            Profile
          </Link>

          {/* Usage Badge */}
          <span
            style={{
              background: "linear-gradient(to right, #2563eb, #3b82f6)",
              color: "white",
              fontWeight: 900,
              padding: "8px 12px",
              borderRadius: 999,
              fontSize: 13,
              boxShadow: "0 10px 22px rgba(59, 130, 246, 0.25)",
              whiteSpace: "nowrap",
            }}
            title={
              usage.signedIn
                ? `Plan: ${usage.plan} • Used: ${usage.usedThisPeriod} • Limit: ${usage.monthlyLimit}`
                : ""
            }
          >
            {badgeText}
          </span>
        </div>
      </div>
    </div>
  )
}
