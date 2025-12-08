// app/dashboard/page.tsx
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-12">Welcome back!</h1>
        <Link href="/upload" className="inline-block bg-blue-600 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:bg-blue-700">
          Upload New Packet →
        </Link>
        <p className="mt-12 text-xl text-gray-600">No packets yet — upload your first one above!</p>
      </div>
    </div>
  )
}
