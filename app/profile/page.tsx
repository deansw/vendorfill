// app/profile/page.tsx — FINAL: VERTICAL STACKED FIELDS WITH LABELS ABOVE
"use client"
import { useState } from "react"

export default function Profile() {
  const [data, setData] = useState({
    companyName: "",
    legalName: "",
    taxId: "",
    dunsNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    website: "",
    entityType: "",
    bankAccount: "",
    bankRouting: "",
    accountingContactName: "",
    accountingEmail: "",
    accountingPhone: "",
    salesContactName: "",
    salesEmail: "",
    salesPhone: "",
    insuranceProvider: "",
    insurancePolicy: "",
    diversityStatus: "",
  })

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const saveProfile = () => {
    localStorage.setItem("vendorProfile", JSON.stringify(data))
    alert("Profile saved! Ready to fill vendor packets.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-8 text-center">
          Your Company Profile
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Fill this once — we'll use it to auto-fill every vendor packet forever.
        </p>

        <div className="bg-white rounded-3xl shadow-2xl p-12 space-y-8">
          {/* VERTICAL STACK: LABEL ABOVE EACH FULL-WIDTH INPUT */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Company Name</label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Legal Name</label>
            <input
              type="text"
              value={data.legalName}
              onChange={(e) => updateField("legalName", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Tax ID / EIN</label>
            <input
              type="password"
              value={data.taxId}
              onChange={(e) => updateField("taxId", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">DUNS Number (optional)</label>
            <input
              type="text"
              value={data.dunsNumber}
              onChange={(e) => updateField("dunsNumber", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Address Line 1</label>
            <input
              type="text"
              value={data.addressLine1}
              onChange={(e) => updateField("addressLine1", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Address Line 2 (optional)</label>
            <input
              type="text"
              value={data.addressLine2}
              onChange={(e) => updateField("addressLine2", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">City</label>
              <input
                type="text"
                value={data.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">State/Province</label>
              <input
                type="text"
                value={data.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">ZIP/Postal Code</label>
              <input
                type="text"
                value={data.zip}
                onChange={(e) => updateField("zip", e.target.value)}
                className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Country</label>
            <input
              type="text"
              value={data.country}
              onChange={(e) => updateField("country", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Website (optional)</label>
            <input
              type="url"
              value={data.website}
              onChange={(e) => updateField("website", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Entity Type (e.g., LLC, C-Corp)</label>
            <input
              type="text"
              value={data.entityType}
              onChange={(e) => updateField("entityType", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Bank Account Number</label>
            <input
              type="password"
              value={data.bankAccount}
              onChange={(e) => updateField("bankAccount", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Bank Routing Number</label>
            <input
              type="text"
              value={data.bankRouting}
              onChange={(e) => updateField("bankRouting", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Contacts</h2>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Accounting Contact Name</label>
            <input
              type="text"
              value={data.accountingContactName}
              onChange={(e) => updateField("accountingContactName", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Accounting Email</label>
            <input
              type="email"
              value={data.accountingEmail}
              onChange={(e) => updateField("accountingEmail", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Accounting Phone</label>
            <input
              type="tel"
              value={data.accountingPhone}
              onChange={(e) => updateField("accountingPhone", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Sales Contact Name</label>
            <input
              type="text"
              value={data.salesContactName}
              onChange={(e) => updateField("salesContactName", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Sales Email</label>
            <input
              type="email"
              value={data.salesEmail}
              onChange={(e) => updateField("salesEmail", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Sales Phone</label>
            <input
              type="tel"
              value={data.salesPhone}
              onChange={(e) => updateField("salesPhone", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Insurance & Certifications</h2>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Insurance Provider</label>
            <input
              type="text"
              value={data.insuranceProvider}
              onChange={(e) => updateField("insuranceProvider", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Insurance Policy Number</label>
            <input
              type="text"
              value={data.insurancePolicy}
              onChange={(e) => updateField("insurancePolicy", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">Diversity Status (e.g., Minority-Owned, Woman-Owned)</label>
            <input
              type="text"
              value={data.diversityStatus}
              onChange={(e) => updateField("diversityStatus", e.target.value)}
              className="w-full p-5 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500"
            />
          </div>

          {/* BIG BLUE SAVE BUTTON */}
          <button
            onClick={saveProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(to right, #2563eb, #3b82f6)",
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
            }}
          >
            Save Profile →
          </button>
        </div>
      </div>
    </div>
  )
}
