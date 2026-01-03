import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const PRICE_TO_PLAN: Record<string, { plan: string; monthly_limit: number }> = {
  "price_1SaN5TLUnMjiPKi9r0UnyAYM": { plan: "starter", monthly_limit: 5 },
  "price_1SlKH6LUnMjiPKi9ozcPR91i": { plan: "pro", monthly_limit: 25 },
  "price_1SlKHdLUnMjiPKi9QaqXhaEZ": { plan: "business", monthly_limit: 75 },
  "price_1SlKHvLUnMjiPKi9RacDSNMf": { plan: "unlimited", monthly_limit: -1 },
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY (must be sk_test_... in test mode)." }, { status: 500 })
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY." }, { status: 500 })
    }

    const origin = req.headers.get("origin") || "https://www.vendorfill.com"
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || origin

    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice("bearer ".length).trim()
      : ""

    if (!token) {
      return NextResponse.json({ error: "Missing Authorization Bearer token." }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    const priceId = body?.priceId

    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json({ error: "priceId is required." }, { status: 400 })
    }
    if (!PRICE_TO_PLAN[priceId]) {
      return NextResponse.json({ error: `Invalid priceId (not mapped): ${priceId}` }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    })

    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData.user) {
      return NextResponse.json({ error: "Not authenticated (supabase.getUser failed)." }, { status: 401 })
    }

    const userId = userData.user.id
    const email = userData.user.email ?? undefined

    const { data: ent, error: entErr } = await supabase
      .from("user_entitlements")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single()

    if (entErr) {
      return NextResponse.json({ error: "Entitlements lookup failed.", details: entErr.message }, { status: 500 })
    }

    let customerId = ent?.stripe_customer_id as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      })
      customerId = customer.id

      const { error: updErr } = await supabase
        .from("user_entitlements")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId)

      if (updErr) {
        return NextResponse.json({ error: "Failed to save stripe_customer_id.", details: updErr.message }, { status: 500 })
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${SITE_URL}/billing/success`,
      cancel_url: `${SITE_URL}/billing`,
      metadata: { supabase_user_id: userId, price_id: priceId },
    })

    if (!session.url) {
      return NextResponse.json({ error: "Stripe session created, but no URL returned." }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error("Stripe checkout error:", e)
    return NextResponse.json(
      { error: e?.message || "Stripe checkout failed.", details: e?.type || e?.raw || null },
      { status: 500 }
    )
  }
}
