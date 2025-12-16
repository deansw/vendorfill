// app/api/fill/route.ts — FULL & FIXED (mockProfile defined)
import { NextRequest } from "next/server"
import OpenAI from "openai"
import { PDFDocument } from "pdf-lib"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Mock profile — defined here so no undefined error
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
    const { pdfBase64 } = await req.json()

    const pdfBytes = Buffer.from(pdfBase64, "base64")

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fieldNames = form.getFields().map(f => f.getName())

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
      } catch (e) {
        // skip missing fields
      }
    })

    form.flatten()
    const filledPdfBytes = await pdfDoc.save()
    const base64Filled = Buffer.from(filledPdfBytes).toString("base64")

    return Response.json({
      success: true,
      filledPdf: `data:application/pdf;base64,${base64Filled}`,
      message: "PDF filled successfully by GPT-4o!",
    })
  } catch (error: any) {
    console.error("Fill error:", error)
    return Response.json({ success: false, error: error.message || "Unknown error" }, { status: 500 })
  }
}
