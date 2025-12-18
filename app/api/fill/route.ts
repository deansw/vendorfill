import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { PDFDocument } from "pdf-lib"

export const runtime = "nodejs"
export const maxDuration = 60

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ✅ STEP A: Profile → Vendor form synonyms (the “translation layer”)
const PROFILE_SYNONYMS: Record<string, string[]> = {
  companyName: ["name of company", "company name", "vendor name", "business name", "supplier name"],
  legalName: ["legal name", "registered name", "entity legal name"],
  taxId: ["tax id", "ein", "tin", "federal id", "tax identification", "taxpayer id"],
  entityType: ["entity type", "legal structure", "incorporation type"],

  addressLine1: ["address", "street address", "address line 1", "mailing address"],
  addressLine2: ["address line 2", "suite", "ste", "unit", "apt"],
  city: ["city", "town"],
  state: ["state", "province", "region"],
  zip: ["zip", "zip code", "postal code"],
  country: ["country"],

  phone: ["phone", "telephone", "telephone number", "phone number", "tel"],
  website: ["website", "web site", "url"],

  accountingEmail: ["email", "e-mail", "accounts payable email", "accounting email", "ap email", "billing email"],
  salesEmail: ["sales email", "contact email", "business email"],

  bankAccount: ["bank account", "account number", "acct number"],
  bankRouting: ["routing", "routing number", "aba", "aba number"],
}

function stripDataUrl(input: string) {
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
    const profile = body?.profile

    if (!pdfBase64Raw || typeof pdfBase64Raw !== "string") {
      return NextResponse.json(
        { success: false, error: "pdfBase64 is required (base64 string)." },
        { status: 400 }
      )
    }
    if (!profile || typeof profile !== "object") {
      return NextResponse.json(
        { success: false, error: "profile is required (object from Profile page)." },
        { status: 400 }
      )
    }

    const pdfBase64 = stripDataUrl(pdfBase64Raw)
    const pdfBytes = Buffer.from(pdfBase64, "base64")

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    const fieldMeta = fields.map((f) => ({
      name: f.getName(),
      type: f.constructor.name,
    }))

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You map a user's company profile into PDF form fields. Output MUST be a single valid JSON object. Keys MUST exactly match the provided PDF field names. Values must be strings.",
        },
        {
          role: "user",
          content: `You are filling a vendor PDF form.

USER PROFILE (source of truth):
${JSON.stringify(profile, null, 2)}

PROFILE FIELD SYNONYMS (use these to match vendor wording to profile keys):
${JSON.stringify(PROFILE_SYNONYMS, null, 2)}

PDF FIELDS (name + type):
${fieldMeta.map((f) => `${f.name} (${f.type})`).join("\n")}

TASK:
For EACH PDF field name, infer what it is asking for and assign the best value from the user profile.
Use the synonym list above as the mapping logic.

DEFAULTS / HEURISTICS:
- If the field is ambiguous "email", prefer accountingEmail, else salesEmail.
- If the field asks for company name, use companyName; if it asks for legal name, use legalName.
- If the field asks for EIN/Tax ID, use taxId.
- If it’s address, prefer addressLine1 + addressLine2 + city/state/zip when appropriate.
- If no confident match, use "N/A".

CRITICAL OUTPUT RULES:
- Output ONE JSON object only (no markdown).
- Include EVERY PDF field name as a key.
- Values must be strings.
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
    } catch {
      return NextResponse.json(
        { success: false, error: "OpenAI response was not valid JSON.", raw: filledText },
        { status: 500 }
      )
    }

    // Ensure all fields exist (if model missed any)
    for (const f of fieldMeta) {
      if (!(f.name in filledData)) filledData[f.name] = "N/A"
    }

    // Fill the PDF
    for (const [name, value] of Object.entries(filledData)) {
      try {
        const field = form.getField(name)
        const v = String(value ?? "")

        if ((field as any).setText) {
          ;(field as any).setText(v)
        } else if ((field as any).check) {
          const lower = v.trim().toLowerCase()
          if (["yes", "true", "1", "x", "checked"].includes(lower)) (field as any).check()
          else if ((field as any).uncheck) (field as any).uncheck()
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
