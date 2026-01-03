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
    const sig = req.headers.get("stripe-signature")
    if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })

    const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 })
    if (!SUPABASE_URL) return NextResponse.json({ error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 })
    if (!SERVICE_ROLE) return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 })

    const rawBody = await req.text()

    const event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    })

    // Helper: update entitlements from a Stripe subscription
    const applySubscription = async (subscriptionId: string, customerId?: string | null, userIdFromMeta?: string | null) => {
      const sub = await stripe.subscriptions.retrieve(subscriptionId)

      const customer = (sub.customer as string) || customerId || null
      let userId = userIdFromMeta || null

      if (!userId && customer) {
        const { data: row } = await supabaseAdmin
          .from("user_entitlements")
          .select("user_id")
          .eq("stripe_customer_id", customer)
          .maybeSingle()
        userId = (row?.user_id as string) || null
      }

      const priceId = sub.items.data?.[0]?.price?.id
      const map = priceId ? PRICE_TO_PLAN[priceId] : null

      if (userId && map) {
        await supabaseAdmin
          .from("user_entitlements")
          .update({
            plan: map.plan,
            monthly_limit: map.monthly_limit,
            stripe_customer_id: customer,
            stripe_subscription_id: sub.id,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
      }
    }

    // ✅ Most important: checkout completion
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const subscriptionId = session.subscription as string | null
      const customerId = session.customer as string | null
      const userId = (session.metadata?.supabase_user_id as string) || null

      if (subscriptionId) {
        await applySubscription(subscriptionId, customerId, userId)
      }

      return NextResponse.json({ received: true })
    }

    // ✅ Also handle subscription updates (in case checkout event was missed)
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription
      await applySubscription(sub.id, sub.customer as string, null)
      return NextResponse.json({ received: true })
    }

    // ✅ Cancel -> downgrade to free (paid uploads locked)
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string

      await supabaseAdmin
        .from("user_entitlements")
        .update({
          plan: "free",
          monthly_limit: 0,
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId)

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error("Stripe webhook error:", e)
    return NextResponse.json({ error: e?.message || "Webhook error" }, { status: 400 })
  }
}
