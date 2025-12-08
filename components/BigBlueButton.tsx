// components/BigBlueButton.tsx
import Link from "next/link"

type Props = {
  children: React.ReactNode
  href: string
}

export default function BigBlueButton({ children, href }: Props) {
  return (
    <Link
      href={href}
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl px-12 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(to right, #2563eb, #3b82f6)",
        boxShadow: "0 10px 30px rgba(59,130,246,0.4)",
      }}
    >
      {children}
    </Link>
  )
}
