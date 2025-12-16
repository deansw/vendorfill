"use client"

export default function PrimaryCtaButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-block",
        width: "100%",
        background: "linear-gradient(to right, #3b82f6, #2563eb)",
        color: "white",
        padding: "24px 56px",
        borderRadius: "16px",
        fontSize: "28px",
        fontWeight: "700",
        border: "none",
        boxShadow: "0 12px 30px rgba(59, 130, 246, 0.5)",
        transition: "all 0.3s ease",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  )
}
