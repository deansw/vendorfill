import { NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export const runtime = "nodejs"
export const maxDuration = 60

function stripDataUrl(input: string) {
  const idx = input.indexOf("base64,")
  return idx >= 0 ? input.slice(idx + "base64,".length) : input
}

function normalizeProfile(profile: any) {
  const addressFull =
    profile.addressFull ||
    [
      profile.addressLine1,
      profile.addressLine2,
      profile.city,
      profile.state,
      profile.zip,
      profile.country,
    ]
      .filter(Boolean)
      .join(", ")

  const repNameTitle =
    profile.companyRepNameTitle ||
    [profile.salesContactName, profile.salesContactTitle].filter(Boolean).join(" — ") ||
    profile.salesContactName ||
    ""

  return {
    ...profile,
    addressFull,
    repNameTitle,
  }
}

function pickFirst(...vals: Array<any>) {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim()
  }
  return ""
}

function valueForField(fieldName: string, profile: any) {
  const n = fieldName.toLowerCase()

  // Company / address
  if (n.includes("name of company")) {
    return pickFirst(profile.companyName, profile.legalName) || "N/A"
  }
  if (n.startsWith("2 address") || (n.includes("address") && !n.includes("email"))) {
    return pickFirst(profile.addressFull) || "N/A"
  }

  // Phone / fax
  if (n.includes("fax")) {
    return pickFirst(profile.fax) || "N/A"
  }
  if (n === "telephone number" || (n.includes("telephone number") && !n.includes("representative"))) {
    return pickFirst(profile.phone) || "N/A"
  }

  // Emails / website
  if (n.includes("direct email") && n.includes("representative")) {
    return pickFirst(profile.salesEmail, profile.accountingEmail) || "N/A"
  }
  if (n.includes("email address") && !n.includes("representative")) {
    // For generic "email", prefer accounting
    return pickFirst(profile.accountingEmail, profile.salesEmail) || "N/A"
  }
  if (n.includes("web site")) {
    return pickFirst(profile.website) || "N/A"
  }

  // Representative
  if (n.includes("name") && n.includes("title") && n.includes("representative")) {
    return pickFirst(profile.repNameTitle) || "N/A"
  }
  if (n.includes("representative") && n.includes("telephone numbers")) {
    // Many forms combine direct + mobile into one box; use salesPhone if present
    return pickFirst(profile.salesPhone, profile.phone) || "N/A"
  }

  // Dates / sales (you may not have these in your profile yet)
  if (n.includes("date company was established")) {
    return pickFirst(profile.dateEstablished) || "N/A"
  }
  if (n.includes("gross") && n.includes("annual") && n.includes("sales")) {
    return "N/A"
  }
  if (n.includes("year") && n.includes("chf")) {
    return "N/A"
  }

  // “Details on services”
  if (n.includes("details") && n.includes("services")) {
    return pickFirst(profile.servicesDetails, profile.businessDescription) || "N/A"
  }

  // Default
  return "N/A"
}

function shouldCheckBox(fieldName: string, profile: any) {
  const n = fieldName.toLowerCase()
  const entity = String(profile.entityType || "").toLowerCase()
  const biz = String(profile.businessType || "").toLowerCase()

  // Legal structure checkbox example
  if (n.includes("partnership")) return entity.includes("partnership")

  // Business type checkboxes (only works if you store businessType or if entityType matches)
  if (n.includes("manufacturer")) return biz.includes("manufacturer")
  if (n.includes("wholesaler")) return biz.includes("wholesaler")
  if (n.includes("retailer")) return biz.includes("retailer")
  if (n.includes("consultant")) return biz.includes("consultant")
  if (n.includes("professional services")) return biz.includes("professional")
  if (n.includes("service provider")) return biz.includes("service")
  if (n.includes("construction")) return biz.includes("construction")
  if (n.includes("freight")) return biz.includes("freight") || biz.includes("transport")

  return false
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const pdfBase64Raw = body?.pdfBase64
    const profileRaw = body?.profile

    if (!pdfBase64Raw || typeof pdfBase64Raw !== "string") {
      return NextResponse.json({ success: false, error: "pdfBase64 is required (base64 string)." }, { status: 400 })
    }
    if (!profileRaw || typeof profileRaw !== "object") {
      return NextResponse.json({ success: false, error: "profile is required (object from Profile page)." }, { status: 400 })
    }

    const profile = normalizeProfile(profileRaw)

    const pdfBase64 = stripDataUrl(pdfBase64Raw)
    const pdfBytes = Buffer.from(pdfBase64, "base64")

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    // Fill deterministically
    for (const f of fields) {
      const name = f.getName()

      try {
        const field = form.getField(name)

        // Text-like
        if ((field as any).setText) {
          const v = valueForField(name, profile)
          ;(field as any).setText(String(v))
          continue
        }

        // Checkbox-like
        if ((field as any).check) {
          if (shouldCheckBox(name, profile)) (field as any).check()
          else if ((field as any).uncheck) (field as any).uncheck()
          continue
        }

        // Dropdown/radio-like
        if ((field as any).select) {
          // If you later add profile values that correspond to selects, handle here
          ;(field as any).select("N/A")
          continue
        }
      } catch {
        // skip
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
    return NextResponse.json({ success: false, error: error?.message || "Unknown error" }, { status: 500 })
  }
}
