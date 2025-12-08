// app/upload/page.tsx
"use client"
import { useState } from "react"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)

  const handle = () => {
    if (!file) return
    const price = file.size > 3000000 ? 129 : 79
    alert(`Processing ${file.name} — Price: $${price}\nYou’ll get your filled PDF in ~5 minutes.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-8">Upload Vendor Packet</h1>
        <div className="bg-white rounded-2xl shadow-xl p-12 border-4 border-dashed border-blue-300">
          <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="block w-full text-lg" />
          {file && <p className="mt-6 text-2xl font-bold">Price: ${file.size > 3000000 ? "129" : "79"}</p>}
          <button onClick={handle} disabled={!file} className="mt-8 w-full bg-blue-600 text-white py-6 rounded-xl text-2xl font-bold hover:bg-blue-700 disabled:opacity-50">
            Pay & Fill Packet →
          </button>
        </div>
      </div>
    </div>
  )
}
