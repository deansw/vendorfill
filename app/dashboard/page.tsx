import BigBlueButton from "@/components/BigBlueButton"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-24 text-center px-6">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-12">
        Welcome back!
      </h1>
      <BigBlueButton href="/upload">Upload New Packet →</BigBlueButton>
      <p className="mt-12 text-xl text-gray-600">No packets yet — upload your first one above!</p>
    </div>
  )
}
