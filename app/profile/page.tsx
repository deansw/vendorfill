// app/profile/page.tsx — FIXED: VERTICALLY STACKED FIELDS
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
          <input
            placeholder="Company Name"
            value={data.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            placeholder="Tax ID / EIN"
            type="password"
            value={data.taxId}
            onChange={(e) => updateField("taxId", e.target.value)}
            className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            placeholder="Bank Account"
            type="password"
            value={data.bankAccount}
            onChange={(e) => updateField("bankAccount", e.target.value)}
            className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            placeholder="Bank Routing"
            value={data.bankRouting}
            onChange={(e) => update
