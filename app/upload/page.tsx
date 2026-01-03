"use client"

import { useMemo, useState } from "react"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"
import { createClient } from "@/utils/supabase/client"

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file) // returns data:application/pdf;base64,....
  })
}

export default function UploadPage() {
  const supabase = useMemo(() => createClient(), [])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [downloadUrl, setDownloadUrl] = useState<string>("")
  const [usageInfo, setUsageInfo] = useState<any>(null)

  const handleUpload = async () => {
    try {
      setError("")
      setNotice("")
      setDownloadUrl("")
      setUsageInfo(null)

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

      // 2) Load profile from localStorage (saved on Profile page)
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

      // 4) Call your API with Authorization header
      const res = await fetch("/api/fill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pdfBase64,
          profile,
        }),
      })

      // 402 means user is blocked (no plan / limit reached)
      if (res.status === 402) {
        const payload = await res.json().catch(() => ({}))
        setUsageInfo(payload?.usage || null)

        const reason = payload?.reason || payload?.usage?.reason || "limit_reached"
        if (reason === "no_active_plan") {
          setError("You’ve used your free upload. Please subscribe to upload more documents.")
        } else if (reason === "limit_reached") {
          setError("You’ve reached your monthly upload limit. Please upgrade your plan.")
        } else {
          setError("Uploads are blocked. Please subscribe or upgrade your plan.")
        }

        setLoading(false)
        return
      }

      // Other non-OK errors
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        setError(payload?.error || "Upload failed. Please try again.")
        setLoading(false)
        return
      }

      const data = await res.json()
      if (!data?.success) {
        setError(data?.error || "Upload failed.")
        setLoading(false)
        return
      }

      setUsageInfo(data?.usage || null)
      setDownloadUrl(data.filledPdf)
      setNotice("✅ Packet filled successfully! Download it below.")
      setLoading(false)
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Something went wrong.")
      setLoading(false)
    }
  }

  return (
    <PageShell title="Upload Vendor Packet" subtitle="Upload a PDF and we’ll auto-fill it using your saved profile.">
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
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

        {usageInfo && (
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#0f172a",
              padding: "14px 16px",
              borderRadius: 14,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Plan: <b>{usageInfo.plan ?? "unknown"}</b> • Period: <b>{usageInfo.period ?? "N/A"}</b>
            {typeof usageInfo.used_this_period === "number" && (
              <>
                {" "}
                • Used this month: <b>{usageInfo.used_this_period}</b>
              </>
            )}
            {typeof usageInfo.remaining_this_period === "number" && (
              <>
                {" "}
                • Remaining: <b>{usageInfo.remaining_this_period}</b>
              </>
            )}
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
          <div
            style={{
              borderRadius: 20,
              border: "3px dashed #bfdbfe",
              padding: 28,
            }}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ fontSize: 18 }}
            />

            {file && (
              <div style={{ marginTop: 16, color: "#0f172a", fontWeight: 800, fontSize: 16 }}>
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
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 10px 30px rgba(59, 130, 246, 0.35)",
                }}
              >
                Download Filled PDF →
              </a>
            </div>
          )}

          <div style={{ marginTop: 18, textAlign: "center", color: "#64748b", fontSize: 16 }}>
            Make sure your <a href="/profile" style={{ color: "#2563eb", fontWeight: 800, textDecoration: "none" }}>Profile</a> is saved before uploading.
          </div>
        </div>
      </div>
    </PageShell>
  )
}
