// app/upload/page.tsx — FIXED: BIG BLUE BUTTON + FILE INPUT (MATCHES HOMEPAGE)
"use client"
import { useState } from "react"
import Link from "next/link"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)

  const getPrice = (size: number) => size > 5_000_000 ? 199 : size > 2_000_000 ? 129 : 79

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f8fafc, #ffffff)", paddingTop: "160px", paddingBottom: "120px", textAlign: "center" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: "60px", fontWeight: "900", lineHeight: "1.1", color: "#0f172a", marginBottom: "32px" }}>
          Upload Vendor Packet
        </h1>
        <p style={{ fontSize: "24px", color: "#64748b", maxWidth: "800px", margin: "0 auto 48px" }}>
          Drop any PDF (Walmart, Boeing, Amazon, etc.) — we'll fill it automatically in minutes.
        </p>

        {/* File Input Area */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          border: "4px dashed #e0e7ff",
          marginBottom: "48px"
        }}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "block", width: "100%", padding: "16px", border: "2px solid #e5e7eb", borderRadius: "12px", fontSize: "18px" }}
          />
          {file && (
            <p style={{ marginTop: "24px", fontSize: "32px", fontWeight: "bold", color: "#3b82f6" }}>
              Price: ${getPrice(file.size)}
            </p>
          )}
          {!file && (
            <p style={{ marginTop: "24px", fontSize: "20px", color: "#9ca3af" }}>
              Select a PDF above to get pricing.
            </p>
          )}
        </div>

        {/* BIG BLUE BUTTON — EXACT SAME AS HOMEPAGE */}
        <Link
          href={file ? "/upload/success" : "#"}
          className="inline-block"
          style={{
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            color: "white",
            padding: "24px 56px",
            borderRadius: "16px",
            fontSize: "28px",
            fontWeight: "700",
            textDecoration: "none",
            boxShadow: "0 12px 30px rgba(59, 130, 246, 0.5)",
            transition: "all 0.3s ease",
            cursor: file ? "pointer" : "not-allowed",
            opacity: file ? 1 : 0.6
          }}
          onMouseEnter={(e) => file && (e.currentTarget.style.background = "linear-gradient(to right, #2563eb, #1d4ed8)")}
          onMouseLeave={(e) => file && (e.currentTarget.style.background = "linear-gradient(to right, #3b82f6, #2563eb)")}
        >
          Pay & Fill Packet →
        </Link>
      </div>
    </div>
  )
}
