"use client"
import { useState } from "react"

type ProfileData = {
  companyName: string
  legalName: string
  taxId: string
  dunsNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  website: string
  entityType: string
  bankAccount: string
  bankRouting: string
  accountingContactName: string
  accountingEmail: string
  accountingPhone: string
  salesContactName: string
  salesEmail: string
  salesPhone: string
  insuranceProvider: string
  insurancePolicy: string
  diversityStatus: string
}

const EMPTY_PROFILE: ProfileData = {
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
}

function loadProfileOnce(): ProfileData {
  if (typeof window === "undefined") return EMPTY_PROFILE
  try {
    const raw = localStorage.getItem("vendorProfile")
    if (!raw) return EMPTY_PROFILE
    const parsed = JSON.parse(raw) as Partial<ProfileData>
    return { ...EMPTY_PROFILE, ...parsed }
  } catch {
    return EMPTY_PROFILE
  }
}

export default function Profile() {
  // ✅ Strongly typed state fixes the "prev implicitly any" error
  const [data, setData] = useState<ProfileData>(() => loadProfileOnce())
  const [savedMsg, setSavedMsg] = useState("")

  const updateField = (field: keyof ProfileData, value: string) => {
    setData((prev: ProfileData) => ({ ...prev, [field]: value }))
  }

  const saveProfile = () => {
    localStorage.setItem("vendorProfile", JSON.stringify(data))
    setSavedMsg("Profile saved! Your uploads will use this info.")
    setTimeout(() => setSavedMsg(""), 2500)
  }

  const Field = ({
    label,
    type = "text",
    value,
    onChange,
  }: {
    label: string
    type?: string
    value: string
    onChange: (v: string) => void
  }) => (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 18,
          fontWeight: 800,
          color: "#334155",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: 14,
          border: "2px solid #e2e8f0",
          fontSize: 18,
          outline: "none",
        }}
      />
    </div>
  )

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      style={{
        fontSize: 30,
        fontWeight: 900,
        color: "#0f172a",
        marginTop: 44,
        marginBottom: 18,
      }}
    >
      {children}
    </h2>
  )

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
        paddingTop: "160px",
        paddingBottom: "120px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <h1
          style={{
            fontSize: "60px",
            fontWeight: "900",
            lineHeight: "1.1",
            color: "#0f172a",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Your Company Profile
        </h1>

        <p style={{ fontSize: "22px", color: "#64748b", marginBottom: "48px", textAlign: "center" }}>
          Fill this once — we’ll use it to auto-fill every vendor packet.
        </p>

        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
            padding: 42,
            maxWidth: 980,
            margin: "0 auto",
          }}
        >
          <Field label="Company Name" value={data.companyName} onChange={(v) => updateField("companyName", v)} />
          <Field label="Legal Name" value={data.legalName} onChange={(v) => updateField("legalName", v)} />
          <Field label="Tax ID / EIN" type="password" value={data.taxId} onChange={(v) => updateField("taxId", v)} />
          <Field label="DUNS Number (optional)" value={data.dunsNumber} onChange={(v) => updateField("dunsNumber", v)} />

          <Field label="Address Line 1" value={data.addressLine1} onChange={(v) => updateField("addressLine1", v)} />
          <Field label="Address Line 2 (optional)" value={data.addressLine2} onChange={(v) => updateField("addressLine2", v)} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
            <Field label="City" value={data.city} onChange={(v) => updateField("city", v)} />
            <Field label="State/Province" value={data.state} onChange={(v) => updateField("state", v)} />
            <Field label="ZIP/Postal Code" value={data.zip} onChange={(v) => updateField("zip", v)} />
          </div>

          <Field label="Country" value={data.country} onChange={(v) => updateField("country", v)} />
          <Field label="Phone Number" type="tel" value={data.phone} onChange={(v) => updateField("phone", v)} />
          <Field label="Website (optional)" type="url" value={data.website} onChange={(v) => updateField("website", v)} />
          <Field label="Entity Type (e.g., LLC, C-Corp)" value={data.entityType} onChange={(v) => updateField("entityType", v)} />

          <Field label="Bank Account Number" type="password" value={data.bankAccount} onChange={(v) => updateField("bankAccount", v)} />
          <Field label="Bank Routing Number" value={data.bankRouting} onChange={(v) => updateField("bankRouting", v)} />

          <SectionTitle>Contacts</SectionTitle>

          <Field label="Accounting Contact Name" value={data.accountingContactName} onChange={(v) => updateField("accountingContactName", v)} />
          <Field label="Accounting Email" type="email" value={data.accountingEmail} onChange={(v) => updateField("accountingEmail", v)} />
          <Field label="Accounting Phone" type="tel" value={data.accountingPhone} onChange={(v) => updateField("accountingPhone", v)} />

          <Field label="Sales Contact Name" value={data.salesContactName} onChange={(v) => updateField("salesContactName", v)} />
          <Field label="Sales Email" type="email" value={data.salesEmail} onChange={(v) => updateField("salesEmail", v)} />
          <Field label="Sales Phone" type="tel" value={data.salesPhone} onChange={(v) => updateField("salesPhone", v)} />

          <SectionTitle>Insurance & Certifications</SectionTitle>

          <Field label="Insurance Provider" value={data.insuranceProvider} onChange={(v) => updateField("insuranceProvider", v)} />
          <Field label="Insurance Policy Number" value={data.insurancePolicy} onChange={(v) => updateField("insurancePolicy", v)} />
          <Field label="Diversity Status (e.g., Minority-Owned)" value={data.diversityStatus} onChange={(v) => updateField("diversityStatus", v)} />

          <button
            onClick={saveProfile}
            style={{
              marginTop: 18,
              width: "100%",
              background: "linear-gradient(to right, #2563eb, #3b82f6)",
              color: "white",
              padding: "24px 56px",
              borderRadius: "16px",
              fontSize: "28px",
              fontWeight: "700",
              border: "none",
              boxShadow: "0 12px 30px rgba(59, 130, 246, 0.5)",
              cursor: "pointer",
            }}
          >
            Save Profile →
          </button>

          {savedMsg && (
            <p style={{ marginTop: 14, textAlign: "center", fontWeight: 800, color: "#16a34a" }}>
              {savedMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
