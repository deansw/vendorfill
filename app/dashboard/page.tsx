import Link from "next/link"

export default function Dashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f8fafc, #ffffff)", paddingTop: "160px", paddingBottom: "120px", textAlign: "center" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: "60px", fontWeight: "900", lineHeight: "1.1", color: "#0f172a", marginBottom: "40px" }}>
          Welcome back!
        </h1>

        {/* BIG BLUE BUTTON — INLINE STYLES, MATCHES HOMEPAGE */}
        <Link
          href="/upload"
          style={{
            display: "inline-block",
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            color: "white",
            padding: "24px 56px",
            borderRadius: "16px",
            fontSize: "28px",
            fontWeight: "700",
            textDecoration: "none",
            boxShadow: "0 12px 30px rgba(59, 130, 246, 0.5)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
        >
          Upload New Packet →
        </Link>

        <p style={{ marginTop: "48px", fontSize: "22px", color: "#64748b" }}>
          No packets yet — upload your first one above!
        </p>
      </div>
    </div>
  )
}
