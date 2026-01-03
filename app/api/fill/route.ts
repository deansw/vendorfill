// app/api/fill/route.ts
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { PDFDocument } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"
export const maxDuration = 60

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function stripDataUrl(input: string) {
  const idx = input.indexOf("base64,")
  return idx >= 0 ? input.slice(idx + "base64,".length) : input
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ success: false, error: "Missing OPENAI_API_KEY on server." }, { status: 500 })
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ success: false, error: "Missing Supabase env vars on server." }, { status: 500 })
    }

    // ✅ Read bearer token from client
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice("bearer ".length).trim()
      : ""

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated. Missing Authorization token." },
        { status: 401 }
      )
    }

    // ✅ Supabase client that uses the user's JWT so auth.uid() works in SQL/RPC
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false },
      }
    )

    // ✅ Consume usage BEFORE doing OpenAI work
    const { data: usage, error: usageError } = await supabase.rpc("consume_upload")

    if (usageError) {
      console.error("consume_upload rpc error:", usageError)
      return NextResponse.json({ success: false, error: "Usage check failed." }, { status: 500 })
    }

    if (!usage?.allowed) {
      // Tell UI why they were blocked
      return NextResponse.json(
        {
          success: false,
          blocked: true,
          reason: usage?.reason || "not_allowed",
          usage,
        },
        { status: 402 } // 402 Payment Required is perfect here
      )
    }

    // -------------------------
    // Continue with your existing body parsing + pdf fill logic...
    // -------------------------
    const body = await req.json().catch(() => null)
    const pdfBase64Raw = body?.pdfBase64
    const profile = body?.profile

    if (!pdfBase64Raw || typeof pdfBase64Raw !== "string") {
      return NextResponse.json({ success: false, error: "pdfBase64 is required (base64 string)." }, { status: 400 })
    }
    if (!profile || typeof profile !== "object") {
      return NextResponse.json({ success: false, error: "profile is required (object from Profile page)." }, { status: 400 })
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
            "You fill PDF form fields. Output MUST be a single valid JSON object. Keys must exactly match given field names. Values must be strings.",
        },
        {
          role: "user",
          content: `Fill this vendor PDF using ONLY the company profile data below.

Company Profile JSON:
${JSON.stringify(profile, null, 2)}

PDF Fields (name + type):
${fieldMeta.map((f) => `${f.name} (${f.type})`).join("\n")}

CRITICAL RULES:
- Output ONE JSON object only.
- Use the profile data to map values to the most relevant fields.
- If a field doesn't match anything in the profile, use "N/A".
- Values must be strings.
`,
        },
      ],
    })

    const filledText = completion.choices?.[0]?.message?.content
    if (!filledText) {
      return NextResponse.json({ success: false, error: "OpenAI returned empty response." }, { status: 500 })
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
      usage, // ✅ return updated usage so UI can show remaining credits
    })
  } catch (error: any) {
    console.error("Fill error:", error)
    return NextResponse.json({ success: false, error: error?.message || "Unknown error" }, { status: 500 })
  }
}
