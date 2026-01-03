import AppNav from "@/app/components/AppNav"
import Link from "next/link"

export default function BillingSuccessPage() {
  return (
    <>
      <AppNav />
      <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f8fafc, #ffffff)", paddingTop: 160, textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: 950, color: "#0f172a" }}>✅ Subscription Activated</h1>
        <p style={{ marginTop: 12, color: "#64748b", fontSize: 18, fontWeight: 700 }}>
          You can now upload more vendor packets.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link
            href="/upload"
            style={{
              display: "inline-block",
              background: "linear-gradient(to right, #2563eb, #3b82f6)",
              color: "white",
              padding: "14px 22px",
              borderRadius: 14,
              fontWeight: 950,
              textDecoration: "none",
              boxShadow: "0 10px 26px rgba(59, 130, 246, 0.25)",
            }}
          >
            Go to Upload →
          </Link>
        </div>
      </div>
    </>
  )
}
