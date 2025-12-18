import { NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export const runtime = "nodejs"
export const maxDuration = 60

function stripDataUrl(input: string) {
  const idx = input.indexOf("base64,")
  return idx >= 0 ? input.slice(idx + "base64,".length) : input
}

function pickFirst(...vals: Array<any>) {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim()
  }
  return ""
}

function normalizeChoice(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
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

// Deterministic mapping for this vendor form
function valueForField(fieldName: string, profile: any) {
  const n = fieldName.toLowerCase()

  // 1) NAME OF COMPANY
  if (n.includes("name of company")) {
    return pickFirst(profile.companyName, profile.legalName) || "N/A"
  }

  // 2) ADDRESS
  if (n.startsWith("2 address") || (n.includes("address") && !n.includes("email"))) {
    return pickFirst(profile.addressFull) || "N/A"
  }

  // 3) TELEPHONE NUMBER
  if (n.includes("telephone number") && !n.includes("representative")) {
    return pickFirst(profile.phone) || "N/A"
  }

  // 4) FAX NUMBER (if you store it later)
  if (n.includes("fax")) {
    return pickFirst(profile.fax) || "N/A"
  }

  // 5) E-MAIL ADDRESS (generic -> prefer accounting)
  if (n.includes("e-mail address") || (n.includes("email address") && !n.includes("representative"))) {
    return pickFirst(profile.accountingEmail, profile.salesEmail) || "N/A"
  }

  // 6) WEB SITE ADDRESS
  if (n.includes("web site") || n.includes("website")) {
    return pickFirst(profile.website) || "N/A"
  }

  // 7) NAME & TITLE OF COMPANY REPRESENTATIVE
  if (n.includes("name") && n.includes("title") && n.includes("representative")) {
    return pickFirst(profile.repNameTitle) || "N/A"
  }

  // 8) DIRECT E-MAIL ADDRESS OF COMPANY REPRESENTATIVE
  if (n.includes("direct") && (n.includes("e-mail") || n.includes("email")) && n.includes("representative")) {
    return pickFirst(profile.salesEmail, profile.accountingEmail) || "N/A"
  }

  // 9/10) Representative phone(s)
  if (n.includes("representative") && (n.includes("direct number") || n.includes("direct"))) {
    return pickFirst(profile.salesPhone, profile.phone) || "N/A"
  }
  if (n.includes("representative") && (n.includes("mobile") || n.includes("cell"))) {
    return pickFirst(profile.salesPhone, profile.phone) || "N/A"
  }

  // Anything else (not covered)
  return "N/A"
}

/**
 * Checkbox matching for Legal Structure
 * Works when checkbox field names contain the option text (LLC, Partnership, etc.)
 */
function shouldCheckLegalStructureBox(fieldName: string, profile: any) {
  const n = normalizeChoice(fieldName)

  // Normalize what user chose
  const chosenRaw = pickFirst(profile.legalStructure, profile.entityType)
  const chosen = normalizeChoice(chosenRaw)

  // Map user inputs -> canonical targets
  const target =
    chosen.includes("llc") ? "llc" :
    (chosen.includes("s corp") || chosen.includes("s corporation") || chosen.includes("s-corp")) ? "s corporation" :
    (chosen.includes("c corp") || chosen.includes("c corporation") || chosen.includes("c-corp")) ? "c corporation" :
    chosen.includes("partnership") ? "partnership" :
    (chosen.includes("sole") || chosen.includes("proprietor")) ? "sole proprietor" :
    (chosen.includes("nonprofit") || chosen.includes("non profit")) ? "nonprofit" :
    ""

  if (!target) return false

  // Only check boxes that look like they are about legal structure
  // (prevents accidentally checking unrelated boxes)
  const looksLikeLegal = n.includes("legal") || n.includes("structure") || n.includes("entity")
  if (!looksLikeLegal) return false

  // Match the option
  if (target === "llc" && n.includes("llc")) return true
  if (target === "s corporation" && (n.includes("s corp") || n.includes("s corporation"))) return true
  if (target === "c corporation" && (n.includes("c corp") || n.includes("c corporation") || n.includes("corporation"))) return true
  if (target === "partnership" && n.includes("partnership")) return true
  if (target === "sole proprietor" && (n.includes("sole") || n.includes("proprietor"))) return true
  if (target === "nonprofit" && (n.includes("nonprofit") || n.includes("non profit"))) return true

  return false
}

export async function POST(req: NextRequest) {
  try {
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

    // OPTIONAL: log checkbox names once to tune matching (uncomment temporarily)
    // console.log(
    //   "Checkbox fields:",
    //   fields
    //     .filter((f) => f.constructor.name.toLowerCase().includes("checkbox"))
    //     .map((f) => f.getName())
    // )

    for (const f of fields) {
      const name = f.getName()

      try {
        const field = form.getField(name)

        // Text-like fields
        if ((field as any).setText) {
          const v = valueForField(name, profile)
          ;(field as any).setText(String(v))
          continue
        }

        // Checkbox-like fields (legal structure)
        if ((field as any).check) {
          const shouldCheck = shouldCheckLegalStructureBox(name, profile)
          if (shouldCheck) (field as any).check()
          else if ((field as any).uncheck) (field as any).uncheck()
          continue
        }

        // Dropdown / select (not used here yet)
        if ((field as any).select) {
          // If your PDF has dropdowns later, we can map these too.
          ;(field as any).select("N/A")
          continue
        }
      } catch {
        // skip missing or unsupported fields
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
