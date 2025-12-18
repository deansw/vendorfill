import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { PDFDocument } from "pdf-lib"

export const runtime = "nodejs"
export const maxDuration = 60

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function stripDataUrl(input: string) {
  const idx = input.indexOf("base64,")
  return idx >= 0 ? input.slice(idx + "base64,".length) : input
}

// STEP A: Profile → Vendor wording synonyms (general mapping help)
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

  accountingContactName: ["accounting contact", "accounts payable contact", "ap contact"],
  salesContactName: ["sales contact", "company representative", "rep name", "representative"],

  bankAccount: ["bank account", "account number", "acct number"],
  bankRouting: ["routing", "routing number", "aba", "aba number"],
}

// STEP B: Form-specific ordered hints (crucial when PDF field names are generic)
// If your PDF has a different order, update this list to match your packet.
const VENDOR_FIELD_HINTS: string[] = [
  "NAME OF COMPANY",
  "ADDRESS",
  "TELEPHONE NUMBER",
  "FAX NUMBER",
  "E-MAIL ADDRESS",
  "WEB SITE ADDRESS",
  "NAME & TITLE OF COMPANY REPRESENTATIVE",
  "DIRECT E-MAIL ADDRESS OF COMPANY REPRESENTATIVE",
  "COMPANY REPRESENTATIVE DIRECT NUMBER",
  "COMPANY REPRESENTATIVE MOBILE NUMBER",
  "DATE COMPANY WAS ESTABLISHED",
  "GROSS ANNUAL SALES (LAST THREE YEARS)",
  "LEGAL STRUCTURE (CHECK ONE)",
  "TYPE OF BUSINESS / COMMODITY / SERVICE (CHECK ONE)",
  "DETAILS ON SERVICES OR GOODS YOUR COMPANY SUPPLIES",
]

function normalizeProfile(profile: any) {
  const addressFull = [
    profile.addressLine1,
    profile.addressLine2,
    profile.city,
    profile.state,
    profile.zip,
    profile.country,
  ]
    .filter(Boolean)
    .join(", ")

  const companyRepNameTitle =
    [profile.salesContactName, profile.salesContactTitle].filter(Boolean).join(" — ") ||
    profile.salesContactName ||
    ""

  return {
    ...profile,
    // Computed / convenience fields for vendor forms:
    addressFull,
    companyRepNameTitle,
    primaryEmail: profile.accountingEmail || profile.salesEmail || "",
    primaryPhone: profile.phone || "",
  }
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
    const profileRaw = body?.profile

    if (!pdfBase64Raw || typeof pdfBase64Raw !== "string") {
      return NextResponse.json(
        { success: false, error: "pdfBase64 is required (base64 string)." },
        { status: 400 }
      )
    }
    if (!profileRaw || typeof profileRaw !== "object") {
      return NextResponse.json(
        { success: false, error: "profile is required (object from Profile page)." },
        { status: 400 }
      )
    }

    const profile = normalizeProfile(profileRaw)

    const pdfBase64 = stripDataUrl(pdfBase64Raw)
    const pdfBytes = Buffer.from(pdfBase64, "base64")

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    // Gather name + type and attach an ORDERED HINT to each field
    const fieldMeta = fields.map((f, i) => ({
      name: f.getName(),
      type: f.constructor.name,
      hint: VENDOR_FIELD_HINTS[i] || "", // if order doesn’t match, update VENDOR_FIELD_HINTS
      index: i,
    }))

    // (Optional) debugging — uncomment once to see your actual field order in logs:
    // console.log("PDF field order:", fieldMeta.map(f => `${f.index}: ${f.name} (${f.type}) HINT=${f.hint}`))

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You fill PDF form fields from a user profile. Output MUST be a single JSON object. Keys MUST exactly match the provided PDF field names. Values MUST be strings.",
        },
        {
          role: "user",
          content: `You are filling a vendor PDF form.

USER PROFILE (source of truth):
${JSON.stringify(profile, null, 2)}

PROFILE FIELD SYNONYMS (use these to match vendor wording to profile keys):
${JSON.stringify(PROFILE_SYNONYMS, null, 2)}

PDF FIELDS (name + type + HINT):
${fieldMeta.map((f) => `${f.name} (${f.type}) — HINT: ${f.hint || "NONE"}`).join("\n")}

TASK:
For EACH PDF field:
- Use the HINT as the primary signal for what the field represents.
- Use the field name as a secondary signal.
- Map the best matching value from the user profile (including computed fields like addressFull).
- If ambiguous "email", choose accountingEmail first, else salesEmail, else primaryEmail.
- If no confident match, use "N/A".

CRITICAL OUTPUT RULES:
- Output ONE JSON object only (no markdown, no backticks).
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

    // Ensure every field exists (if model missed any)
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
