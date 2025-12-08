// app/profile/page.tsx
"use client"
import { useState } from "react"
import Link from "next/link"

export default function Profile() {
  const [data, setData] = useState({
    companyName: "", taxId: "", bankAccount: "", bankRouting: "",
    accountingEmail: "", salesEmail: ""
  })

  const save = () => {
    localStorage.setItem("vendorProfile", JSON.stringify(data))
    alert("Profile saved! Ready to fill packets.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Your Company Profile</h1>
        <div className="bg-white rounded-2xl shadow-xl p-10 space-y-6">
          <input placeholder="Company Name" className="w-full p-4 border rounded-lg" onChange={e => setData({...data, companyName: e.target.value})} />
          <input placeholder="Tax ID / EIN" className="w-full p-4 border rounded-lg" onChange={e => setData({...data, taxId: e.target.value})} />
          <input placeholder="Bank Account" type="password" className="w-full p-4 border rounded-lg" onChange={e => setData({...data, bankAccount: e.target.value})} />
          <input placeholder="Bank Routing" className="w-full p-4 border rounded-lg" onChange={e => setData({...data, bankRouting: e.target.value})} />
          <input placeholder="Accounting Email" type="email" className="w-full p-4 border rounded-lg" onChange={e => setData({...data, accountingEmail: e.target.value})} />
          <input placeholder="Sales Email" type="email" className="w-full p-4 border rounded-lg" onChange={e => setData({...data, salesEmail: e.target.value})} />
          <button onClick={save} className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-xl hover:bg-blue-700">
            Save Profile & Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
