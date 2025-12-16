"use client"
import { useState } from "react"
import PageShell from "@/components/PageShell"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF")
    setLoading(true)
    alert(`Processing ${file.name}... (AI will fill in 10-40 seconds)`)
    setLoading(false)
  }

  const price =
    !file ? null : file.size > 5_000_000 ? "199" : file.size > 2_000_000 ? "129" : "79"

  return (
    <PageShell
      title="Upload Vendor Packet"
      subtitle="Drop any PDF — we'll fill it automatically in minutes."
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          padding: "48px",
          border: "3px dashed rgba(59,130,246,0.35)",
          maxWidth: "900px",
          margin: "0 auto 48px auto",
          textAlign: "left",
        }}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{
            width: "100%",
            fontSize: "18px",
          }}
        />

        {price && (
          <p
            style={{
              marginTop: "28px",
              fontSize: "28px",
              fontWeight: "800",
              color: "#2563eb",
              textAlign: "center",
            }}
          >
            Price: ${price}
          </p>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{
          display: "inline-block",
          background: "linear-gradient(to right, #3b82f6, #2563eb)",
          color: "white",
          padding: "24px 56px",
          borderRadius: "16px",
          fontSize: "28px",
          fontWeight: "700",
          border: "none",
          textDecoration: "none",
          boxShadow: "0 12px 30px rgba(59, 130, 246, 0.5)",
          transition: "all 0.3s ease",
          cursor: !file || loading ? "not-allowed" : "pointer",
          opacity: !file || loading ? 0.6 : 1,
        }}
      >
        {loading ? "Processing..." : "Pay & Fill Packet →"}
      </button>
    </PageShell>
  )
}
