// app/api/webhook/route.ts — FINAL WITH EMAIL DELIVERY
import { NextRequest } from "next/server"
import Stripe from "stripe"
import { PDFDocument } from "pdf-lib"
import OpenAI from "openai"
import { Resend } from "resend"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!
  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const { pdfUrl, fileName } = session.metadata!
    const customerEmail = session.customer_details?.email || "customer@example.com"

    // Download PDF
    const pdfBytes = await fetch(pdfUrl).then(r => r.arrayBuffer())
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fieldNames = form.getFields().map(f => f.getName())

    // OpenAI fills it
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `Fill this vendor form using ONLY the data below.

Company Data:
${JSON.stringify(mockProfile, null, 2)}

Form fields:
${fieldNames.join("\n")}

Output ONLY valid JSON with field name as key and value as string.
Never hallucinate. Use "N/A" if unsure.`,
        },
      ],
    })

    const filledText = completion.choices[0].message.content!
    const filledData = JSON.parse(filledText)

    // Fill the PDF
    Object.entries(filledData).forEach(([name, value]) => {
      try {
        const field = form.getField(name)
        if (field.constructor.name.includes("TextField")) {
          ;(field as any).setText(String(value))
        } else if (field.constructor.name.includes("CheckBox")) {
          if (String(value).toLowerCase().includes("yes")) (field as any).check()
        }
      } catch (e) {}
    })

    form.flatten()
    const filledPdfBytes = await pdfDoc.save()

    // EMAIL DELIVERY WITH RESEND (this replaces the console.log)
    await resend.emails.send({
      from: "VendorFill AI <no-reply@yourdomain.com>", // change to your verified sender
      to: customerEmail,
      subject: `Your filled vendor packet - ${fileName}`,
      text: "Your AI-filled vendor packet is attached. Thank you for using VendorFill AI!",
      attachments: [
        {
          filename: `FILLED_${fileName}`,
          content: Buffer.from(filledPdfBytes),
        },
      ],
    })
  }

  return Response.json({ received: true })
}
