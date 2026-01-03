import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// ✅ MUST match the same mapping
const PRICE_TO_PLAN: Record<string, { plan: string; monthly_limit: number }> = {
  "price_STARTER_ID_HERE": { plan: "starter", monthly_limit: 5 },
  "price_PRO_ID_HERE": { plan: "pro", monthly_limit: 25 },
  "price_BUSINESS_ID_HERE": { plan: "business", monthly_limit: 75 },
  "price_UNLIMITED_ID_HERE": { plan: "unlimited", monthly_limit: -1 },
}

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get("stripe-signature")
    if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })

    const rawBody = await req.text()

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    })

    // We update entitlements when subscription becomes active
    if (
      event.type === "checkout.session.completed" ||
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const obj: any = event.data.object

      let subscription: Stripe.Subscription | null = null
      let customerId: string | null = null
      let userId: string | null = null

      if (event.type === "checkout.session.completed") {
        customerId = obj.customer
        userId = obj.metadata?.supabase_user_id || null
        if (obj.subscription) {
          subscription = await stripe.subscriptions.retrieve(obj.subscription)
        }
      } else {
        subscription = obj as Stripe.Subscription
        customerId = (subscription.customer as string) || null
      }

      if (!userId && customerId) {
        // fallback: find user via entitlements.customer_id
        const { data: row } = await supabaseAdmin
          .from("user_entitlements")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single()
        userId = (row?.user_id as string) || null
      }

      if (subscription && userId) {
        const priceId = subscription.items.data?.[0]?.price?.id
        const map = priceId ? PRICE_TO_PLAN[priceId] : null

        if (map) {
          await supabaseAdmin
            .from("user_entitlements")
            .update({
              plan: map.plan,
              monthly_limit: map.monthly_limit,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
        }
      }
    }

    // Handle cancel -> revert to free (no paid uploads)
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
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error("webhook error:", e)
    return NextResponse.json({ error: e?.message || "Webhook error" }, { status: 400 })
  }
}
