// app/layout.tsx — FULL WITH LOGIN LINK IN HEADER
import "./globals.css"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {/* Global Header — appears on every page */}
        <header style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px"
            }}>
              VF
            </div>
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#1e293b" }}>
              VendorFill AI
            </span>
          </Link>

          {/* Navigation Links — including Login */}
          <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <Link href="/dashboard" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>
              Dashboard
            </Link>
            <Link href="/upload" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>
              Upload
            </Link>
            <Link href="/profile" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>
              Profile
            </Link>
            <Link href="/login" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>
              Login
            </Link>
          </nav>
        </header>

        {/* Page Content */}
        <main style={{ paddingTop: "100px", minHeight: "100vh", background: "linear-gradient(to bottom, #f8fafc, #ffffff)" }}>
          {children}
        </main>

        {/* Global Footer */}
        <footer style={{
          padding: "3rem 2rem",
          textAlign: "center",
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          color: "#64748b",
          fontSize: "14px"
        }}>
          © 2025 VendorFill AI — All rights reserved
        </footer>
      </body>
    </html>
  )
}
