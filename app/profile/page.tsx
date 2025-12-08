"use client"
import BigBlueButton from "@/components/BigBlueButton"

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-center text-gray-900 mb-12">
          Your Company Profile
        </h1>
        <div className="bg-white rounded-3xl shadow-2xl p-12 space-y-8">
          <input placeholder="Company Name" className="w-full p-5 border rounded-xl text-lg" />
          <input placeholder="Tax ID / EIN" type="password" className="w-full p-5 border rounded-xl text-lg" />
          <input placeholder="Bank Account" type="password" className="w-full p-5 border rounded-xl text-lg" />
          <input placeholder="Bank Routing" className="w-full p-5 border rounded-xl text-lg" />
          <input placeholder="Accounting Email" type="email" className="w-full p-5 border rounded-xl text-lg" />
          <div className="pt-6">
            <BigBlueButton href="/dashboard">Save Profile</BigBlueButton>
          </div>
        </div>
      </div>
    </div>
  )
}
