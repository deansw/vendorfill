"use client"
import { useState } from "react"
import BigBlueButton from "@/components/BigBlueButton"

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-12">
          Upload Vendor Packet
        </h1>
        <div className="bg-white rounded-3xl shadow-2xl p-16 border-4 border-dashed border-blue-200">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-lg"
          />
          {file && (
            <p className="mt-8 text-3xl font-bold text-blue-600">
              Price: ${file.size > 5000000 ? "199" : file.size > 2000000 ? "129" : "79"}
            </p>
          )}
          <div className="mt-12">
            <BigBlueButton href="/upload/success">
              Pay & Fill Packet
            </BigBlueButton>
          </div>
        </div>
      </div>
    </div>
  )
}
