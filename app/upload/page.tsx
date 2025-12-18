"use client"
import { useMemo, useState } from "react"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.onload = () => resolve(String(reader.result)) // data:application/pdf;base64,....
    reader.readAsDataURL(file)
  })
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filledPdfUrl, setFilledPdfUrl] = useState<string | null>(null)

  const price = useMemo(() => {
    if (!file) return null
    return file.size > 5_000_000 ? "199" : file.size > 2_000_000 ? "129" : "79"
  }, [file])

  const handleChoose = async (selected: File | null) => {
    setFile(selected)
    setError("")
    setFilledPdfUrl(null)

    if (!selected) return

    // ✅ Auto-run as soon as they pick a file
    setLoading(true)

    try {
      const pdfBase64 = await fileToBase64(selected)

      const res = await fetch("/api/fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64 }),
      })

      const json = await res.json()

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Fill failed")
      }

      setFilledPdfUrl(json.filledPdf)

      // ✅ Auto-download immediately (optional)
      const outName = selected.name.replace(/\.pdf$/i, "") + "-FILLED.pdf"
      downloadDataUrl(json.filledPdf, outName)
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell title="Upload Vendor Packet" subtitle="Choose a PDF — we’ll fill it and return a completed version.">
      <div
        style={{
          background: "white",
          borderRadius: 24,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          padding: 48,
          border: "3px dashed rgba(59,130,246,0.35)",
          maxWidth: 900,
          margin: "0 auto 32px auto",
          textAlign: "left",
        }}
      >
        <label style={{ display: "block", fontSize: 18, fontWeight: 800, color: "#334155", marginBottom: 10 }}>
          Choose your vendor packet (PDF)
        </label>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => handleChoose(e.target.files?.[0] || null)}
          disabled={loading}
          style={{ width: "100%", fontSize: 18 }}
        />

        {file && (
          <div style={{ marginTop: 18, color: "#64748b", fontSize: 16 }}>
            <div><b>File:</b> {file.name}</div>
            <div><b>Size:</b> {(file.size / (1024 * 1024)).toFixed(2)} MB</div>
          </div>
        )}

        {price && (
          <p style={{ marginTop: 18, fontSize: 22, fontWeight: 800, color: "#2563eb", textAlign: "center" }}>
            Price: ${price}
          </p>
        )}

        {loading && (
          <p style={{ marginTop: 16, fontSize: 18, fontWeight: 800, color: "#0f172a", textAlign: "center" }}>
            Processing… (this can take 10–40 seconds)
          </p>
        )}

        {error && (
          <p style={{ marginTop: 16, color: "#dc2626", fontWeight: 800, textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* If you prefer a manual button instead of auto-run, you can wire this to a separate handler. */}
        <PrimaryCtaButton
          onClick={() => {
            if (filledPdfUrl && file) {
              downloadDataUrl(filledPdfUrl, file.name.replace(/\.pdf$/i, "") + "-FILLED.pdf")
            }
          }}
          disabled={!filledPdfUrl}
        >
          Download Filled Packet →
        </PrimaryCtaButton>
      </div>
    </PageShell>
  )
}
