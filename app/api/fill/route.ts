// app/api/fill/route.ts — FINAL WORKING CLAUDE 3.5 (v0.9+ SDK)
import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { PDFDocument } from "pdf-lib"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Mock profile — replace with real Supabase fetch later
const mockProfile = {
  companyName: "Acme Corp",
  legalName: "Acme Corporation Inc.",
  taxId: "12-3456789",
  entityType: "C-Corp",
  address: "123 Main St, San Francisco, CA 94105",
  phone: "(555) 123-4567",
  bankAccount: "1234567890",
  bankRouting: "021000021",
  accountingEmail: "accounting@acme.com",
  salesEmail: "sales@acme.com",
}

export async function POST(req: NextRequest) {
  try {
    const { pdfUrl } = await req.json()

    const pdfBytes = await fetch(pdfUrl).then(r => r.arrayBuffer())
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fieldNames = form.getFields().map(f => f.getName())

    const completion = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
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

    const filledData = JSON.parse((completion.content[0] as any).text)

    // Fill PDF
    Object.entries(filledData).forEach(([name, value]) => {
      try {
        const field = form.getField(name)
        if (field.constructor.name.includes("TextField")) {
          ;(field as any).setText(String(value))
        } else if (field.constructor.name.includes("CheckBox")) {
          if (String(value).toLowerCase().includes("yes")) (field as any).check()
        }
      } catch (e) {
        // skip missing fields
      }
    })

    form.flatten()
    const filledPdfBytes = await pdfDoc.save()
    const base64 = Buffer.from(filledPdfBytes).toString("base64")

    return Response.json({
      success: true,
      filledPdf: `data:application/pdf;base64,${base64}`,
    })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
