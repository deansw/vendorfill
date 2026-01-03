"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { createClient } from "@/utils/supabase/client"

function NavLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        textDecoration: "none",
        fontWeight: 900,
        color: active ? "#0f172a" : "#334155",
        background: active ? "#e2e8f0" : "transparent",
      }}
    >
      {label}
    </Link>
  )
}

export default function AppNav() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push("/login")
    setLoading(false)
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(248, 250, 252, 0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/dashboard"
          style={{
            fontWeight: 950,
            fontSize: 18,
            color: "#0f172a",
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          VendorFill
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/upload" label="Upload" />
          <NavLink href="/profile" label="Profile" />
          <NavLink href="/billing" label="Billing" />
        </div>

        <button
          onClick={logout}
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            background: "white",
            fontWeight: 900,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
          }}
        >
          {loading ? "Signing out..." : "Logout"}
        </button>
      </div>
    </div>
  )
}
