"use client"
import { useState } from "react"
import PageShell from "@/components/PageShell"
import PrimaryCtaButton from "@/components/PrimaryCtaButton"

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

  const updateField = (field: keyof typeof data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const saveProfile = () => {
    localStorage.setItem("vendorProfile", JSON.stringify(data))
    alert("Profile saved! Ready to fill vendor packets.")
  }

  const Field = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
  }: {
    label: string
    type?: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
  }) => (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 18,
          fontWeight: 700,
          color: "#334155",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "18px 18px",
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
        textAlign: "left",
      }}
    >
      {children}
    </h2>
  )

  return (
    <PageShell
      title="Your Company Profile"
      subtitle="Fill this once — we'll use it to auto-fill every vendor packet forever."
    >
      <div
        style={{
          background: "white",
          borderRadius: 24,
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          padding: 42,
          maxWidth: 980,
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <Field
          label="Company Name"
          value={data.companyName}
          onChange={(v) => updateField("companyName", v)}
        />
        <Field
          label="Legal Name"
          value={data.legalName}
          onChange={(v) => updateField("legalName", v)}
        />
        <Field
          label="Tax ID / EIN"
          type="password"
          value={data.taxId}
          onChange={(v) => updateField("taxId", v)}
        />
        <Field
          label="DUNS Number (optional)"
          value={data.dunsNumber}
          onChange={(v) => updateField("dunsNumber", v)}
        />
        <Field
          label="Address Line 1"
          value={data.addressLine1}
          onChange={(v) => updateField("addressLine1", v)}
        />
        <Field
          label="Address Line 2 (optional)"
          value={data.addressLine2}
          onChange={(v) => updateField("addressLine2", v)}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 18,
          }}
        >
          <Field label="City" value={data.city} onChange={(v) => updateField("city", v)} />
          <Field label="State/Province" value={data.state} onChange={(v) => updateField("state", v)} />
          <Field label="ZIP/Postal Code" value={data.zip} onChange={(v) => updateField("zip", v)} />
        </div>

        <Field
          label="Country"
          value={data.country}
          onChange={(v) => updateField("country", v)}
        />
        <Field
          label="Phone Number"
          type="tel"
          value={data.phone}
          onChange={(v) => updateField("phone", v)}
        />
        <Field
          label="Website (optional)"
          type="url"
          value={data.website}
          onChange={(v) => updateField("website", v)}
        />
        <Field
          label="Entity Type (e.g., LLC, C-Corp)"
          value={data.entityType}
          onChange={(v) => updateField("entityType", v)}
        />
        <Field
          label="Bank Account Number"
          type="password"
          value={data.bankAccount}
          onChange={(v) => updateField("bankAccount", v)}
        />
        <Field
          label="Bank Routing Number"
          value={data.bankRouting}
          onChange={(v) => updateField("bankRouting", v)}
        />

        <SectionTitle>Contacts</SectionTitle>

        <Field
          label="Accounting Contact Name"
          value={data.accountingContactName}
          onChange={(v) => updateField("accountingContactName", v)}
        />
        <Field
          label="Accounting Email"
          type="email"
          value={data.accountingEmail}
          onChange={(v) => updateField("accountingEmail", v)}
        />
        <Field
          label="Accounting Phone"
          type="tel"
          value={data.accountingPhone}
          onChange={(v) => updateField("accountingPhone", v)}
        />

        <Field
          label="Sales Contact Name"
          value={data.salesContactName}
          onChange={(v) => updateField("salesContactName", v)}
        />
        <Field
          label="Sales Email"
          type="email"
          value={data.salesEmail}
          onChange={(v) => updateField("salesEmail", v)}
        />
        <Field
          label="Sales Phone"
          type="tel"
          value={data.salesPhone}
          onChange={(v) => updateField("salesPhone", v)}
        />

        <SectionTitle>Insurance & Certifications</SectionTitle>

        <Field
          label="Insurance Provider"
          value={data.insuranceProvider}
          onChange={(v) => updateField("insuranceProvider", v)}
        />
        <Field
          label="Insurance Policy Number"
          value={data.insurancePolicy}
          onChange={(v) => updateField("insurancePolicy", v)}
        />
        <Field
          label="Diversity Status (e.g., Minority-Owned)"
          value={data.diversityStatus}
          onChange={(v) => updateField("diversityStatus", v)}
        />

        <div style={{ marginTop: 28 }}>
          <PrimaryCtaButton onClick={saveProfile}>Save Profile →</PrimaryCtaButton>
        </div>
      </div>
    </PageShell>
  )
}

