// app/upload/page.tsx — PROFESSIONAL VERSION (MATCHES HOMEPAGE)
"use client"
import { useState } from "react"
import Link from "next/link"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)

  const handleUpload = () => {
    if (!file) {
      alert("Please select a PDF first!")
      return
    }
    // Mock payment — replace with Stripe later
    alert(`Processing ${file.name}... Price: $${file.size > 5000000 ? 199 : file.size > 2000000 ? 129 : 79}`)
    // Redirect to success or email
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-12">
          Upload Vendor Packet
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Drop any PDF (Walmart, Boeing, Amazon, etc.) — we'll fill it automatically in minutes.
        </p>
        <div className="bg-white rounded-3xl shadow-2xl p-16 border-4 border-dashed border-blue-200 mb-12">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-lg file:mr-6 file:py-4 file:px-8 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-8"
          />
          {file && (
            <p className="text-3xl font-bold text-blue-600 mb-8">
              Price: ${file.size > 5000000 ? "199" : file.size > 2000000 ? "129" : "79"}
            </p>
          )}
          {!file && (
            <p className="text-xl text-gray-600 mb-8">
              Select a PDF above to get pricing.
            </p>
          )}
        </div>
        <button
          onClick={handleUpload}
          disabled={!file}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl px-12 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50"
          style={{
            background: "linear-gradient(to right, #2563eb, #3b82f6)",
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
          }}
        >
          Pay & Fill Packet →
        </button>
      </div>
    </div>
  )
}
