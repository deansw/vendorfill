// app/api/create-checkout-session/route.ts — STRIPE CHECKOUT
import { NextRequest } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { price, pdfBase64, fileName } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Vendor Packet Processing - ${fileName}`,
              description: "AI-filled vendor onboarding form",
            },
            unit_amount: price * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/upload/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/upload`,
      metadata: {
        pdfBase64, // We'll use this on success to fill the PDF
        fileName,
      },
    })

    return Response.json({ sessionId: session.id })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
