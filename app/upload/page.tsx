"use client"

import { useEffect, useMemo, useState } from "react"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"
import { createClient } from "@/utils/supabase/client"
import AppNav from "@/components/AppNav"

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function utcPeriodKey() {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

function PricingModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  const plans = [
    { name: "Starter", docs: "5 documents / month", price: "$19.99" },
    { name: "Pro", docs: "25 documents / month", price: "$49.99" },
    { name: "Business", docs: "75 documents / month", price: "$139.99" },
    { name: "Unlimited", docs: "Unlimited documents / month", price: "$279.99" },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 720,
          background: "white",
          borderRadius: 24,
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
          padding: 26,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 950, color: "#0f172a" }}>
              Upgrade to keep uploading
            </h2>
            <p style={{ marginTop: 8, marginBottom: 0, color: "#64748b", fontSize: 16, fontWeight: 700 }}>
              You’ve used your free upload. Choose a plan to continue.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "1px solid #e2e8f0",
              background: "#fff",
              borderRadius: 12,
              padding: "10px 12px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {plans.map((p) => (
            <div
              key={p.name}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 16,
                background: "linear-gradient(to bottom, #ffffff, #f8fafc)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>{p.name}</div>
              <div style={{ marginTop: 6, color: "#334155", fontWeight: 800 }}>{p.docs}</div>
              <div style={{ marginTop: 10, fontSize: 22, fontWeight: 950, color: "#2563eb" }}>{p.price}</div>

              <a
                href="/billing"
                style={{
                  display: "inline-block",
                  marginTop: 14,
                  width: "100%",
                  textAlign: "center",
                  padding: "12px 14px",
                  borderRadius: 14,
                  textDecoration: "none",
                  fontWeight: 950,
                  color: "white",
                  background: "linear-gradient(to right, #2563eb, #3b82f6)",
                  boxShadow: "0 10px 26px rgba(59, 130, 246, 0.25)",
                }}
              >
                Choose {p.name} →
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, color: "#64748b", fontWeight: 700, fontSize: 14, textAlign: "center" }}>
          Don’t have billing set up yet? The button can temporarily link to a placeholder page.
        </div>
      </div>
    </div>
  )
}

export default function UploadPage() {
  const supabase = useMemo(() => createClient(), [])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [downloadUrl, setDownloadUrl] = useState<string>("")

  const [showPricing, setShowPricing] = useState(false)

  // Preload entitlements/usage to show banners
  const [freeAvailable, setFreeAvailable] = useState<boolean>(false)
  const [planLabel, setPlanLabel] = useState<string>("")
  const [remainingLabel, setRemainingLabel] = useState<string>("")

  const refreshUsage = async () => {
    const { data: sessionData } = await supabase.auth.getSession()
    const session = sessionData.session
    if (!session) {
      setFreeAvailable(false)
      setPlanLabel("")
      setRemainingLabel("")
      return
    }

    const period = utcPeriodKey()

    const { data: ent } = await supabase
      .from("user_entitlements")
      .select("plan, monthly_limit, free_used")
      .single()

    const { data: usageRow } = await supabase
      .from("user_usage")
      .select("used_count")
      .eq("period", period)
      .maybeSingle()

    const plan = ent?.plan ?? "free"
    const monthlyLimit = Number(ent?.monthly_limit ?? 0)
    const free = ent ? !ent.free_used : true
    const used = Number(usageRow?.used_count ?? 0)

    setFreeAvailable(free)
    setPlanLabel(plan)

    if (free) {
      setRemainingLabel("🎁 1 free upload available")
    } else if (monthlyLimit === -1) {
      setRemainingLabel("♾️ Unlimited uploads")
    } else if (monthlyLimit <= 0) {
      setRemainingLabel("0 uploads remaining")
    } else {
      setRemainingLabel(`${Math.max(0, monthlyLimit - used)} uploads remaining this month`)
    }
  }

  useEffect(() => {
    refreshUsage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpload = async () => {
    try {
      setError("")
      setNotice("")
      setDownloadUrl("")

      if (!file) {
        setError("Please choose a PDF file.")
        return
      }

      // 1) Require user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setError(sessionError.message)
        return
      }

      const token = sessionData.session?.access_token
      if (!token) {
        setError("You must be logged in to upload. Please log in and try again.")
        return
      }

      // 2) Load profile
      const rawProfile = localStorage.getItem("vendorProfile")
      if (!rawProfile) {
        setError("Please complete your Profile first. Go to Profile and click Save Profile.")
        return
      }

      let profile: any
      try {
        profile = JSON.parse(rawProfile)
      } catch {
        setError("Profile data is corrupted. Please re-save your profile.")
        return
      }

      setLoading(true)

      // 3) Convert PDF to base64
      const pdfBase64 = await fileToBase64(file)

      // 4) Call API with Authorization header
      const res = await fetch("/api/fill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pdfBase64, profile }),
      })

      // 402 => blocked: show pricing modal
      if (res.status === 402) {
        setShowPricing(true)
        setLoading(false)
        await refreshUsage()
        return
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        setError(payload?.error || "Upload failed. Please try again.")
        setLoading(false)
        await refreshUsage()
        return
      }

      const data = await res.json()
      if (!data?.success) {
        setError(data?.error || "Upload failed.")
        setLoading(false)
        await refreshUsage()
        return
      }

      setDownloadUrl(data.filledPdf)
      setNotice("✅ Packet filled successfully! Download it below.")
      setLoading(false)

      // refresh usage badge/banners after successful consume
      await refreshUsage()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Something went wrong.")
      setLoading(false)
      await refreshUsage()
    }
  }

  return (
    <>
      <AppNav />
      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />

      <PageShell title="Upload Vendor Packet" subtitle="Upload a PDF and we’ll auto-fill it using your saved profile.">
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px" }}>
          {/* 🎁 First upload banner */}
          {freeAvailable && (
            <div
              style={{
                background: "linear-gradient(to right, #eff6ff, #ffffff)",
                border: "1px solid #bfdbfe",
                color: "#1d4ed8",
                padding: "14px 16px",
                borderRadius: 16,
                fontWeight: 950,
                textAlign: "center",
                marginBottom: 16,
                boxShadow: "0 12px 28px rgba(59, 130, 246, 0.12)",
              }}
            >
              🎁 Your first upload is free — upload a vendor packet to test VendorFill.
            </div>
          )}

          {/* Usage banner */}
          {(planLabel || remainingLabel) && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#0f172a",
                padding: "12px 14px",
                borderRadius: 14,
                fontWeight: 800,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Plan: <b>{planLabel || "free"}</b> • {remainingLabel || ""}
            </div>
          )}

          {notice && (
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #bbf7d0",
                color: "#166534",
                padding: "14px 16px",
                borderRadius: 14,
                fontWeight: 800,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              {notice}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#9f1239",
                padding: "14px 16px",
                borderRadius: 14,
                fontWeight: 800,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              background: "white",
              borderRadius: 24,
              boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
              padding: 28,
            }}
          >
            <div style={{ borderRadius: 20, border: "3px dashed #bfdbfe", padding: 28 }}>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ fontSize: 18 }}
              />

              {file && (
                <div style={{ marginTop: 16, color: "#0f172a", fontWeight: 900, fontSize: 16 }}>
                  Selected: {file.name}
                </div>
              )}
            </div>

            <div style={{ marginTop: 18 }}>
              <PrimaryCtaButton onClick={handleUpload} disabled={!file || loading}>
                {loading ? "Processing..." : "Upload & Fill →"}
              </PrimaryCtaButton>
            </div>

            {downloadUrl && (
              <div style={{ marginTop: 18, textAlign: "center" }}>
                <a
                  href={downloadUrl}
                  download="vendor-packet-filled.pdf"
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(to right, #2563eb, #3b82f6)",
                    color: "white",
                    padding: "16px 26px",
                    borderRadius: 14,
                    fontSize: 18,
                    fontWeight: 950,
                    textDecoration: "none",
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.35)",
                  }}
                >
                  Download Filled PDF →
                </a>
              </div>
            )}

            <div style={{ marginTop: 18, textAlign: "center", color: "#64748b", fontSize: 16 }}>
              Make sure your{" "}
              <a href="/profile" style={{ color: "#2563eb", fontWeight: 900, textDecoration: "none" }}>
                Profile
              </a>{" "}
              is saved before uploading.
            </div>
          </div>
        </div>
      </PageShell>
    </>
  )
}
