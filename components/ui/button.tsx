// components/ui/button.tsx — FINAL WORKING VERSION (no type errors, no dependencies)
import Link from "next/link"
import { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "lg"
  className?: string
  onClick?: () => void
  type?: "button" | "submit"
}

export function Button({
  children,
  href,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  }

  const sizes = {
    default: "h-10 px-6",
    lg: "h-12 px-8 text-lg",
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
