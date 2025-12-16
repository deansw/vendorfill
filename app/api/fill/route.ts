// app/api/fill/route.ts
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { PDFDocument } from "pdf-lib"

// ✅ Force Node.js runtime (Buffer + pdf-lib are safest here)
export const runtime = "nodejs"
// Optional: give Vercel more time for large PDFs
export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

function stripDataUrl(input: string) {
  // Handles "data:application/pdf;base64,XXXX"
  const idx = input.indexOf("base64,")
  return idx >= 0 ? input.slice(idx + "base64,".length) : input
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Missing OPENAI_API_KEY on server." },
        { status: 500 }
      )
    }

    const body = await req.json().catch(() => null)
    const pdfBase64Raw = body?.pdfBase64

    if (!pdfBase64Raw || typeof pdfBase64Raw !== "string") {
      return NextResponse.json(
        { success: false, error: "pdfBase64 is required (base64 string)." },
        { status: 400 }
      )
    }

    const pdfBase64 = stripDataUrl(pdfBase64Raw)

    let pdfBytes: Uint8Array
    try {
      pdfBytes = Buffer.from(pdfBase64, "base64")
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid base64 PDF input." },
        { status: 400 }
      )
    }

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()
    const fieldNames = fields.map((f) => f.getName())

    // ✅ Force the model to return strict JSON (no code fences, no commentary)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You fill PDF form fields. Output MUST be a single valid JSON object. Values must be strings.",
        },
        {
          role: "user",
          content: `Fill this vendor form using ONLY the data below.

Company Data:
${JSON.stringify(mockProfile, null, 2)}

Form fields:
${fieldNames.join("\n")}

Rules:
- Output ONLY JSON (no markdown, no backticks).
- JSON keys MUST exactly match the field names.
- Values must be strings.
- If unsure, use "N/A".
`,
        },
      ],
    })

    const filledText = completion.choices?.[0]?.message?.content
    if (!filledText) {
      return NextResponse.json(
        { success: false, error: "OpenAI returned empty response." },
        { status: 500 }
      )
    }

    let filledData: Record<string, string>
    try {
      filledData = JSON.parse(filledText)
    } catch (e: any) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI response was not valid JSON.",
          raw: filledText,
        },
        { status: 500 }
      )
    }

    // Fill the PDF
    for (const [name, value] of Object.entries(filledData)) {
      try {
        const field = form.getField(name)

        // pdf-lib field types differ; safest is feature-detect methods
        const v = String(value ?? "")

        if ((field as any).setText) {
          ;(field as any).setText(v)
        } else if ((field as any).check) {
          // treat "yes/true/1/x" as checked
          const lower = v.trim().toLowerCase()
          if (["yes", "true", "1", "x", "checked"].includes(lower)) {
            ;(field as any).check()
          } else if ((field as any).uncheck) {
            ;(field as any).uncheck()
          }
        } else if ((field as any).select) {
          ;(field as any).select(v)
        }
      } catch {
        // skip missing fields
      }
    }

    form.flatten()

    const filledPdfBytes = await pdfDoc.save()
    const base64Filled = Buffer.from(filledPdfBytes).toString("base64")

    return NextResponse.json({
      success: true,
      filledPdf: `data:application/pdf;base64,${base64Filled}`,
      message: "PDF filled successfully!",
    })
  } catch (error: any) {
    console.error("Fill error:", error)
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}

