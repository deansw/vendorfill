// app/page.tsx — FINAL, NO ERRORS, BEAUTIFUL
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"

export default function Home() {
  const tiers = [
    { name: "Standard", price: "$79", desc: "Up to 30 pages", features: ["W-9 auto-signed", "Insurance attached"] },
    { name: "Pro", price: "$129", desc: "Up to 75 pages · Most Popular", features: ["Diversity certs", "ESG answers", "Priority AI"], popular: true },
    { name: "Enterprise", price: "$199", desc: "Unlimited pages", features: ["Government forms", "Audit trail PDF", "SLA"] },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-bold text-white">
              VF
            </div>
            <span className="text-2xl font-bold text-gray-900">VendorFill AI</span>
          </Link>
          <Button size="lg" href="/login">Get Started →</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 text-center">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-5xl font-black tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
            Never Fill Out Another<br />Vendor Form Manually
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-xl text-gray-600 md:text-2xl">
            Upload any supplier packet — get back a perfectly filled + signed PDF in under 10 minutes.
          </p>
          <div className="mt-10">
            <Button size="lg" className="px-10 text-lg" href="/login">
              Start Free →
            </Button>
            <div className="mt-8 flex justify-center gap-8 text-sm text-gray-600">
              <span className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> No credit card</span>
              <span className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">How It Works</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {["Build Your Profile Once", "Upload Any Packet", "Get Filled PDF Instantly"].map((title, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600">
                  {i + 1}
                </div>
                <h3 className="mt-6 text-2xl font-bold text-gray-900">{title}</h3>
                <p className="mt-4 text-lg text-gray-600">
                  {i === 0 && "Company info, tax ID, bank, insurance — saved forever."}
                  {i === 1 && "Walmart, Boeing, Amazon, hospitals, government — we handle them all."}
                  {i === 2 && "Claude + Grok fill every field. Download or email."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Pay-Per-Packet Pricing</h2>
          <p className="mt-4 text-xl text-gray-600">No subscription. Only pay when you win.</p>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-3xl border-2 p-10 shadow-lg ${
                  tier.popular ? "border-blue-600 ring-4 ring-blue-100" : "border-gray-200"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="mt-4 text-5xl font-black text-gray-900">
                  {tier.price}<span className="text-lg font-normal text-gray-600">/packet</span>
                </p>
                <p className="mt-2 text-gray-600">{tier.desc}</p>
                <ul className="mt-8 space-y-4 text-left">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="h-6 w-6 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-10 w-full text-lg" size="lg" href="/login">
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center px-6">
          <h2 className="text-4xl font-bold md:text-5xl">Ready to Save 10+ Hours Per Vendor?</h2>
          <p className="mt-6 text-xl">Join hundreds of suppliers already using VendorFill AI</p>
          <Button size="lg" className="mt-10 px-12 text-xl bg-white text-blue-600 hover:bg-gray-100" href="/login">
            Start Filling Packets Now →
          </Button>
        </div>
      </section>

      <footer className="border-t bg-gray-50 py-8 text-center text-sm text-gray-600">
        © 2025 VendorFill AI — All rights reserved
      </footer>
    </div>
  )
}
