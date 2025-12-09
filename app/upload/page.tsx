// app/upload/page.tsx — FULL & WORKING (OPENAI OR ANTHROPIC)
"use client"
import { useState } from "react"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF first!")
      return
    }

    setLoading(true)

    // Convert file to base64 (remove data URL prefix)
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1] // pure base64

      try {
        const res = await fetch("/api/fill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64: base64 }),
        })

        const data = await res.json()

        if (data.success) {
          // Trigger download
          const link = document.createElement("a")
          link.href = data.filledPdf
          link.download = `FILLED_${file.name}`
          link.click()
          alert("Your filled PDF has been downloaded!")
        } else {
          alert("Error: " + (data.error || "Unknown error"))
        }
      } catch (err) {
        console.error(err)
        alert("Something went wrong. Check the console.")
      } finally {
        setLoading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-12">
          Upload Vendor Packet
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Drop any PDF — we'll fill it automatically in minutes.
        </p>

        {/* File Input Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-16 border-4 border-dashed border-blue-200 mb-12">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-lg file:mr-6 file:py-4 file:px-8 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-10 text-3xl font-bold text-blue-600">
              Price: ${file.size > 5_000_000 ? "199" : file.size > 2_000_000 ? "129" : "79"}
            </p>
          )}
          {!file && (
            <p className="mt-10 text-xl text-gray-600">
              Select a PDF above to see pricing.
            </p>
          )}
        </div>

        {/* BIG BLUE BUTTON — IDENTICAL TO HOMEPAGE */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl px-12 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50"
          style={{
            background: "linear-gradient(to right, #2563eb, #3b82f6)",
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
          }}
        >
          {loading ? "Processing with AI..." : "Pay & Fill Packet →"}
        </button>
      </div>
    </div>
  )
}
