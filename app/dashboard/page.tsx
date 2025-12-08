// app/dashboard/page.tsx — FINAL: BIG BLUE BUTTON LIKE HOMEPAGE
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 text-center px-6">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-12">
          Welcome back!
        </h1>

        {/* EXACT SAME BLUE BUTTON AS HOMEPAGE */}
        <Link
          href="/upload"
          className="inline-block bg-blue-600 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          style={{
            background: "linear-gradient(to right, #2563eb, #3b82f6)",
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
          }}
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
