// app/dashboard/page.tsx — FIXED FOR TIMEOUT
"use client"

import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 text-center px-6">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-12">
          Welcome back!
        </h1>

        <Link
          href="/upload"
          className="inline-block bg-blue-600 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
        >
          Upload New Packet →
        </Link>

        <p className="mt-12 text-xl text-gray-600">
          No packets yet — upload your first one above!
        </p>
      </div>
    </div>
  )
}
