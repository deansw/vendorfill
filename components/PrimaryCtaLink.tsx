import Link from "next/link"

export default function PrimaryCtaLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
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
      {children}
    </Link>
  )
}
