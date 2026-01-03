import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY." }, { status: 500 })
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY." },
        { status: 500 }
      )
    }

    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice("bearer ".length).trim()
      : ""

    if (!token) {
      return NextResponse.json({ error: "Missing Authorization Bearer token." }, { status: 401 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    })

    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData.user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
    }

    const userId = userData.user.id

    const { data: ent, error: entErr } = await supabase
      .from("user_entitlements")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single()

    if (entErr) {
      return NextResponse.json({ error: "Entitlements lookup failed.", details: entErr.message }, { status: 500 })
    }

    if (!ent?.stripe_customer_id) {
      return NextResponse.json({ error: "No Stripe customer found for this user yet." }, { status: 400 })
    }

    const returnUrl =
      process.env.STRIPE_CUSTOMER_PORTAL_RETURN_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get("origin") ||
      "https://www.vendorfill.com/dashboard"

    const session = await stripe.billingPortal.sessions.create({
      customer: ent.stripe_customer_id,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error("Stripe portal error:", e)
    return NextResponse.json({ error: e?.message || "Portal failed." }, { status: 500 })
  }
}
