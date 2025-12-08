// app/profile/page.tsx — FIXED: VERTICALLY STACKED WITH LABELS ABOVE
"use client"
import { useState } from "react"

export default function Profile() {
  const [data, setData] = useState({
    companyName: "",
    taxId: "",
    bankAccount: "",
    bankRouting: "",
    accountingEmail: "",
    salesEmail: ""
  })

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const saveProfile = () => {
    localStorage.setItem("vendorProfile", JSON.stringify(data))
    alert("Profile saved! Ready to fill packets.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-8 text-center">
          Your Company Profile
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-xl mx-auto">
          Fill this once — we'll use it to auto-fill every vendor packet forever.
        </p>
        <div className="bg-white rounded-3xl shadow-2xl p-12 space-y-6">
          {/* VERTICALLY STACKED FIELDS WITH LABELS ABOVE */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Company Name</label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Tax ID / EIN</label>
            <input
              type="password"
              value={data.taxId}
              onChange={(e) => updateField("taxId", e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Bank Account Number</label>
            <input
              type="password"
              value={data.bankAccount}
              onChange={(e) => updateField("bankAccount", e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Bank Routing Number</label>
            <input
              type="text"
              value={data.bankRouting}
              onChange={(e) => updateField("bankRouting", e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Accounting Contact Email</label>
            <input
              type="email"
              value={data.accountingEmail}
              onChange={(e) => updateField("accountingEmail", e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Sales Contact Email</label>
            <input
              type="email"
              value={data.salesEmail}
              onChange={(e) => updateField("salesEmail", e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* BIG BLUE BUTTON — SAME AS HOMEPAGE */}
          <button
            onClick={saveProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(to right, #2563eb, #3b82f6)",
              boxShadow: "0 10px 30px rgba(59,130,246,0.4)"
            }}
          >
            Save Profile →
          </button>
        </div>
      </div>
    </div>
  )
}
