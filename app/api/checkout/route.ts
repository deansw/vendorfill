import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// ✅ PASTE your 4 Stripe Price IDs here:
const PRICE_TO_PLAN: Record<string, { plan: string; monthly_limit: number }> = {
  // Starter (5/mo) — $19.99
  "price_1SaN5TLUnMjiPKi9r0UnyAYM": { plan: "starter", monthly_limit: 5 },

  // Pro (25/mo) — $49.99
  "price_1SlKH6LUnMjiPKi9ozcPR91iE": { plan: "pro", monthly_limit: 25 },

  // Business (75/mo) — $139.99
  "price_1SlKHdLUnMjiPKi9QaqXhaEZ": { plan: "business", monthly_limit: 75 },

  // Unlimited — $279.99
  "price_1SlKHvLUnMjiPKi9RacDSNMf": { plan: "unlimited", monthly_limit: -1 },
}

export async function POST(req: NextRequest) {
  try {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!SITE_URL) return NextResponse.json({ error: "Missing NEXT_PUBLIC_SITE_URL" }, { status: 500 })
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: "Missing Supabase public env vars" }, { status: 500 })
    }

    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice("bearer ".length).trim()
      : ""

    if (!token) {
      return NextResponse.json({ error: "Missing Authorization Bearer token" }, { status: 401 })
    }

    const { priceId } = await req.json()

    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 })
    }

    if (!PRICE_TO_PLAN[priceId]) {
      return NextResponse.json({ error: "Invalid priceId" }, { status: 400 })
    }

    // ✅ Use the user's JWT to identify them
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    })

    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = userData.user.id
    const email = userData.user.email ?? undefined

    // Look up existing customer id (if any)
    const { data: ent } = await supabase
      .from("user_entitlements")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single()

    let customerId = ent?.stripe_customer_id as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      })
      customerId = customer.id
    }

    // Create Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${SITE_URL}/billing/success`,
      cancel_url: `${SITE_URL}/billing`,
      metadata: { supabase_user_id: userId, price_id: priceId },
    })

    // Save customer id if newly created
    if (!ent?.stripe_customer_id) {
      await supabase
        .from("user_entitlements")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId)
    }

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error("checkout error:", e)
    return NextResponse.json({ error: e?.message || "Checkout failed" }, { status: 500 })
  }
}
