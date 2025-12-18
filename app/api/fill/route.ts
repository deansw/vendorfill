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

function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function normalizeProfile(profile: any) {
  const addressFull =
    profile.addressFull ||
    [profile.addressLine1, profile.addressLine2, profile.city, profile.state, profile.zip, profile.country]
      .filter(Boolean)
      .join(", ")

  const repNameTitle =
    profile.companyRepNameTitle ||
    [profile.salesContactName, profile.salesContactTitle].filter(Boolean).join(" — ") ||
    profile.salesContactName ||
    ""

  return { ...profile, addressFull, repNameTitle }
}

// Deterministic mapping for your vendor form text fields
function valueForField(fieldName: string, profile: any) {
  const n = fieldName.toLowerCase()

  if (n.includes("name of company")) return pickFirst(profile.companyName, profile.legalName) || "N/A"
  if (n.startsWith("2 address") || (n.includes("address") && !n.includes("email")))
    return pickFirst(profile.addressFull) || "N/A"
  if (n.includes("telephone number") && !n.includes("representative")) return pickFirst(profile.phone) || "N/A"
  if (n.includes("fax")) return pickFirst(profile.fax) || "N/A"
  if (n.includes("e-mail address") || (n.includes("email address") && !n.includes("representative")))
    return pickFirst(profile.accountingEmail, profile.salesEmail) || "N/A"
  if (n.includes("web site") || n.includes("website")) return pickFirst(profile.website) || "N/A"
  if (n.includes("name") && n.includes("title") && n.includes("representative"))
    return pickFirst(profile.repNameTitle) || "N/A"
  if (n.includes("direct") && (n.includes("e-mail") || n.includes("email")) && n.includes("representative"))
    return pickFirst(profile.salesEmail, profile.accountingEmail) || "N/A"
  if (n.includes("representative") && (n.includes("direct number") || n.includes("direct")))
    return pickFirst(profile.salesPhone, profile.phone) || "N/A"
  if (n.includes("representative") && (n.includes("mobile") || n.includes("cell")))
    return pickFirst(profile.salesPhone, profile.phone) || "N/A"

  return "N/A"
}

// Turn user choice into a robust “token set”
function getLegalStructureTokens(profile: any) {
  const chosenRaw = pickFirst(profile.legalStructure, profile.entityType)
  const chosen = normalize(chosenRaw)

  // Canonicalize common inputs
  if (chosen.includes("nonprofit") || chosen.includes("non profit") || chosen.includes("not for profit") || chosen === "nfp") {
    return ["nonprofit", "non profit", "not for profit", "nfp", "charitable"]
  }
  if (chosen.includes("llc")) return ["llc", "l l c", "limited liability"]
  if (chosen.includes("s corp") || chosen.includes("s corporation")) return ["s corp", "s corporation"]
  if (chosen.includes("c corp") || chosen.includes("c corporation") || chosen.includes("corporation"))
    return ["c corp", "c corporation", "corporation", "inc"]
  if (chosen.includes("partnership")) return ["partnership", "partner"]
  if (chosen.includes("sole") || chosen.includes("proprietor")) return ["sole", "proprietor", "sole proprietor"]

  // Fallback: use whatever they typed
  return chosen ? [chosen] : []
}

function textMatchesAnyToken(text: string, tokens: string[]) {
  const t = normalize(text)
  return tokens.some((tok) => t.includes(normalize(tok)))
}

/**
 * ✅ Try to check a checkbox if its name looks like the chosen legal structure.
 * This works ONLY if checkbox field names contain the option text.
 */
function shouldCheckThisCheckbox(fieldName: string, tokens: string[]) {
  return textMatchesAnyToken(fieldName, tokens)
}

/**
 * ✅ Try to select a radio option (or dropdown option) for legal structure.
 * Works if the field has options that contain “nonprofit”, etc.
 */
function trySelectLegalStructure(field: any, fieldName: string, tokens: string[]) {
  if (!field?.select) return false

  // Some pdf-lib fields (radio groups) expose getOptions()
  const opts: string[] = typeof field.getOptions === "function" ? field.getOptions() : []

  // If we have options, pick the best match
  if (opts.length > 0) {
    const match = opts.find((o) => textMatchesAnyToken(o, tokens))
    if (match) {
      field.select(match)
      return true
    }
  }

  // If no options are exposed, we can still try selecting by token as a last resort
  // (works on some PDFs where option values are the label text)
  for (const tok of tokens) {
    try {
      field.select(tok)
      return true
    } catch {
      // keep trying
    }
  }

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
    const tokens = getLegalStructureTokens(profile)

    const pdfBase64 = stripDataUrl(pdfBase64Raw)
    const pdfBytes = Buffer.from(pdfBase64, "base64")

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    // ✅ DEBUG LOGS (leave on until it’s fixed, then remove)
    // This will show you what the PDF actually calls those fields on Vercel logs.
    console.log("Legal structure chosen:", pickFirst(profile.legalStructure, profile.entityType))
    console.log("Legal structure tokens:", tokens)

    const checkboxNames = fields
      .filter((f) => f.constructor.name.toLowerCase().includes("checkbox"))
      .map((f) => f.getName())
    console.log("Checkbox fields:", checkboxNames)

    const selectableNames = fields
      .filter((f) => ["pdfradiogroup", "pdfdropdown", "pdfoptionlist"].includes(f.constructor.name.toLowerCase()))
      .map((f) => `${f.constructor.name}:${f.getName()}`)
    console.log("Selectable fields (radio/dropdown/list):", selectableNames)

    // Fill fields
    for (const f of fields) {
      const name = f.getName()

      try {
        const field = form.getField(name)

        // Text fields
        if ((field as any).setText) {
          const v = valueForField(name, profile)
          ;(field as any).setText(String(v))
          continue
        }

        // Checkbox fields
        if ((field as any).check) {
          const shouldCheck = tokens.length > 0 && shouldCheckThisCheckbox(name, tokens)
          if (shouldCheck) (field as any).check()
          else if ((field as any).uncheck) (field as any).uncheck()
          continue
        }

        // Radio group / dropdown / option list
        if ((field as any).select) {
          // Try selecting the legal structure choice if this looks related
          // (We don’t require the field name to contain “legal” because many PDFs don’t.)
          const selected = tokens.length > 0 ? trySelectLegalStructure(field, name, tokens) : false

          // If we didn’t select anything, leave it alone
          if (!selected) {
            // do nothing
          }
          continue
        }
      } catch {
        // skip unknown field types
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
