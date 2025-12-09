// app/upload/page.tsx — FULL FILE WITH SUPABASE STORAGE UPLOAD
"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client" // your Supabase client (already in starter)

const supabase = createClient()

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const getPrice = (size: number) => (size > 5_000_000 ? 19900 : size > 2_000_000 ? 12900 : 7900) // cents

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF first!")
      return
    }

    setLoading(true)

    try {
      // 1. Upload PDF to Supabase Storage (bucket: packets, public)
      const filePath = `pending/${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("packets")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Get public URL
      const { data: urlData } = supabase.storage.from("packets").getPublicUrl(filePath)
      const publicUrl = urlData.publicUrl

      // 3. Create Stripe Checkout session with short URL
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: getPrice(file.size),
          pdfUrl: publicUrl,
          fileName: file.name,
        }),
      })

      const data = await res.json()

      if (data.sessionId) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        await stripe?.redirectToCheckout({ sessionId: data.sessionId })
      } else {
        alert("Error: " + data.error)
      }
    } catch (err: any) {
      console.error(err)
      alert("Upload failed: " + err.message)
    } finally {
      setLoading(false)
    }
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

        <div className="bg-white rounded-3xl shadow-2xl p-16 border-4 border-dashed border-blue-200 mb-12">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-lg file:mr-6 file:py-4 file:px-8 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-10 text-3xl font-bold text-blue-600">
              Price: ${getPrice(file.size) / 100}
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl px-12 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50"
          style={{
            background: "linear-gradient(to right, #2563eb, #3b82f6)",
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
          }}
        >
          {loading ? "Uploading & Redirecting..." : "Pay & Fill Packet →"}
        </button>
      </div>
    </div>
  )
}
