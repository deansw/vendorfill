// components/ui/button.tsx
import { forwardRef } from "react"
import Link from "next/link"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "lg"
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "default", size = "default", href, className = "", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 bg-white hover:bg-gray-50",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    }

    const sizes = {
      size === "lg" ? "h-11 px-8 text-lg" : "h-10 px-6"

    const classes = `${base} ${variants[variant]} ${sizes} ${className}`

    if (href) {
      return (
        <Link href={href} className={classes} {...props}>
          {children}
        </Link>
      )
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
export { Button }
