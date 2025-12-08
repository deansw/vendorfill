import Link from "next/link"

export default function Dashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f8fafc, #ffffff)", paddingTop: "160px", paddingBottom: "120px", textAlign: "center" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: "60px", fontWeight: "900", lineHeight: 1.1, color: "#0f172a", marginBottom: "32px" }}>
          Welcome back!
        </h1>

        {/* BIG BLUE BUTTON — EXACT SAME AS HOMEPAGE */}
        <Link
          href="/upload"
          style={{
            display: "inline-block",
            background: "#3b82f6",
            color: "white",
            padding: "20px 48px",
            borderRadius: "12px",
            fontSize: "24px",
            fontWeight: "600",
            textDecoration: "none",
            boxShadow: "0 10px 25px rgba(59,130,246,0.4)",
            transition: "all 0.2s",
            border: "none",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.boxShadow = "0 15px 35px rgba(59,130,246,0.6)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#3b82f6"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(59,130,246,0.4)"; }}
        >
          Upload New Packet →
        </Link>

        <p style={{ marginTop: "48px", fontSize: "20px", color: "#64748b" }}>
          No packets yet — upload your first one above!
        </p>
      </div>
    </div>
  )
}
