import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

export const runtime = "nodejs"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null

function isAdminEmail(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  return !!email && allow.includes(email.toLowerCase())
}

export async function GET(req: NextRequest) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: "Missing Supabase public env vars." }, { status: 500 })
    }
    if (!SERVICE_ROLE) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 })
    }

    // Auth the caller (must be logged in + admin email)
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice("bearer ".length).trim()
      : ""
    if (!token) return NextResponse.json({ error: "Missing Authorization token." }, { status: 401 })

    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    })

    const { data: userData } = await supabaseUser.auth.getUser()
    const user = userData.user
    if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
    if (!isAdminEmail(user.email)) return NextResponse.json({ error: "Forbidden." }, { status: 403 })

    // Admin client
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    })

    const periodKey = new Date().toISOString().slice(0, 7) // YYYY-MM

    // Total users
    const { count: totalUsers } = await supabaseAdmin
      .from("user_entitlements")
      .select("user_id", { count: "exact", head: true })

    // Active subscribers = plan != free and monthly_limit != 0
    const { count: activeSubs } = await supabaseAdmin
      .from("user_entitlements")
      .select("user_id", { count: "exact", head: true })
      .neq("plan", "free")
      .neq("monthly_limit", 0)

    // Total uploads this period
    const { data: usageRows, error: usageErr } = await supabaseAdmin
      .from("user_usage")
      .select("user_id, used_count")
      .eq("period", periodKey)

    if (usageErr) {
      return NextResponse.json({ error: "Usage query failed.", details: usageErr.message }, { status: 500 })
    }

    const uploadsThisPeriod = (usageRows || []).reduce((sum, r) => sum + (r.used_count || 0), 0)

    // Top users by usage this period
    const topUsers = (usageRows || [])
      .sort((a, b) => (b.used_count || 0) - (a.used_count || 0))
      .slice(0, 10)

    // Optional: Stripe revenue this month (test mode is fine)
    // NOTE: this is "payments" based; not perfect MRR, but a great quick metric.
    let stripeRevenueThisMonth: number | null = null
    if (stripe) {
      const start = new Date()
      start.setUTCDate(1)
      start.setUTCHours(0, 0, 0, 0)

      const charges = await stripe.charges.list({
        created: { gte: Math.floor(start.getTime() / 1000) },
        limit: 100,
      })

      stripeRevenueThisMonth = charges.data
        .filter((c) => c.paid && !c.refunded)
        .reduce((sum, c) => sum + (c.amount || 0), 0) / 100
    }

    return NextResponse.json({
      period: periodKey,
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubs || 0,
      uploadsThisPeriod,
      topUsers,
      stripeRevenueThisMonth,
    })
  } catch (e: any) {
    console.error("admin metrics error:", e)
    return NextResponse.json({ error: e?.message || "Admin metrics failed." }, { status: 500 })
  }
}
