import type { ReactNode } from "react"

export default function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
        paddingTop: "160px",
        paddingBottom: "120px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <h1
          style={{
            fontSize: "60px",
            fontWeight: "900",
            lineHeight: "1.1",
            color: "#0f172a",
            marginBottom: subtitle ? "24px" : "40px",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p style={{ fontSize: "22px", color: "#64748b", marginBottom: "48px" }}>
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  )
}
