"use client"
import { useState } from "react"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
          Upload Vendor Packet
        </h1>
        <div className="bg-white rounded-3xl shadow-2xl p-16 border-4 border-dashed border-blue-200">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-lg file:mr-6 file:py-4 file:px-8 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-8 text-3xl font-bold text-blue-600">
              Price: ${file.size > 5_000_000 ? "199" : file.size > 2_000_000 ? "129" : "79"}
            </p>
          )}
          <button
            onClick={() => alert("Payment + AI processing would start here")}
            disabled={!file}
            className="mt-10 w-full bg-blue-600 text-white py-6 rounded-xl text-2xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg"
          >
            Pay & Fill Packet →
          </button>
        </div>
      </div>
    </div>
  )
}
