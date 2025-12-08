// app/page.tsx — PROFESSIONAL STYLING VERSION
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
    <div className="gradient-bg min-h-screen">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-2xl font-bold text-white">
              VF
            </div>
            <span className="text-2xl font-bold text-gray-900">VendorFill AI</span>
          </Link>
          <Button className="btn-primary px-8" href="/login">Get Started →</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-hero lg:text-7xl mb-8">
            Never Fill Out Another<br />Vendor Form Manually
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 leading-relaxed">
            Upload any supplier packet — get back a perfectly filled + signed PDF in under 10 minutes.
          </p>
          <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <Button className="btn-primary text-lg px-10 py-4" href="/login">
              Start Free →
            </Button>
            <div className="flex gap-8 text-sm text-gray-600">
              <span className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> No credit card</span>
              <span className="flex items-center gap-2"><Check className="h-5 w-5 text-green-600" /> Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 md:text-5xl">How It Works</h2>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { step: "1", title: "Build Your Profile Once", desc: "Company info, tax ID, bank, insurance — saved forever." },
              { step: "2", title: "Upload Any Packet", desc: "Walmart, Boeing, Amazon, hospitals, government — we handle them all." },
              { step: "3", title: "Get Filled PDF Instantly", desc: "Claude + Grok fill every field. Download or email." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600">
                  {item.step}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-lg text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 md:text-5xl">Pay-Per-Packet Pricing</h2>
          <p className="text-xl text-gray-600 mb-16">No subscription. Only pay when you win a contract.</p>
          <div className="grid gap-8 md:grid-cols-3">
            {tiers.map((tier) => (
              <div key={tier.name} className={`card relative ${tier.popular ? 'border-blue-600 shadow-xl ring-2 ring-blue-200' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{tier.name}</h3>
                <p className="text-5xl font-black text-gray-900 mb-2">
                  {tier.price}<span className="text-lg font-normal text-gray-600">/packet</span>
                </p>
                <p className="text-gray-600 mb-8">{tier.desc}</p>
                <ul className="space-y-4 mb-8 text-left">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full btn-primary text-lg py-3" href="/login">
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold md:text-5xl mb-6">Ready to Save 10+ Hours Per Vendor?</h2>
          <p className="text-xl mb-8">Join hundreds of suppliers already using VendorFill AI</p>
          <Button className="btn-primary text-xl px-12 py-4 bg-white text-blue-600 hover:bg-gray-100" href="/login">
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
