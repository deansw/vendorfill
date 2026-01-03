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

export default function AppNav() {
  const supabase = useMemo(() => createClient(), [])
  const [label, setLabel] = useState("")

  useEffect(() => {
    const run = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        setLabel("")
        return
      }

      const period = utcPeriodKey()

      const { data: ent } = await supabase
        .from("user_entitlements")
        .select("plan, monthly_limit, free_used")
        .single()

      const { data: usage } = await supabase
        .from("user_usage")
        .select("used_count")
        .eq("period", period)
        .maybeSingle()

      if (ent && !ent.free_used) {
        setLabel("🎁 1 free upload")
        return
      }

      if (ent?.monthly_limit === -1) {
        setLabel("♾️ Unlimited")
        return
      }

      const remaining = Math.max(
        0,
        Number(ent?.monthly_limit ?? 0) - Number(usage?.used_count ?? 0)
      )

      setLabel(`${remaining} remaining`)
    }

    run()
  }, [supabase])

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.9)",
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
        }}
      >
        <Link
          href="/dashboard"
          style={{
            fontWeight: 900,
            fontSize: 18,
            color: "#0f172a",
            textDecoration: "none",
          }}
        >
          VendorFill
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/upload" style={{ fontWeight: 800, color: "#334155", textDecoration: "none" }}>
            Upload
          </Link>
          <Link href="/profile" style={{ fontWeight: 800, color: "#334155", textDecoration: "none" }}>
            Profile
          </Link>

          {label && (
            <span
              style={{
                background: "linear-gradient(to right, #2563eb, #3b82f6)",
                color: "white",
                fontWeight: 900,
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13,
              }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
