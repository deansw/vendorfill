// FORCE DEPLOY — VENDORFILL LIVE 2025
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Coins, UserCheck, Database, FileText, Zap, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white border-b fixed w-full z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            VF
          </div>
          <span className="text-xl font-bold">VendorFill AI</span>
        </Link>
        <nav className="ml-auto flex gap-8">
          <a href="#how" className="text-sm font-medium hover:text-blue-600">How it works</a>
          <a href="#pricing" className="text-sm font-medium hover:text-blue-600">Pricing</a>
        </nav>
        <Button className="ml-8">
          <Link href="/login">Get Started →</Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Never Fill Out Another<br />Vendor Form Manually
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload any supplier onboarding packet (Walmart, Boeing, Amazon, hospitals, government…) — 
            get back a perfectly filled + signed PDF in under 10 minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              <Link href="/login">Start Free →</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
          <div className="mt-12 flex justify-center gap-12 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Check className="w-5 h-5 text-green-600" /> No credit card required</div>
            <div className="flex items-center gap-2"><Check className="w-5 h-5 text-green-600" /> Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">1. Build Your Profile Once</h3>
              <p className="text-gray-600">Company info, tax ID, bank details, insurance certs — saved forever.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">2. Upload Any Vendor Packet</h3>
              <p className="text-gray-600">PDF or web portal — we handle Walmart, Target, Boeing, SAM.gov, etc.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">3. Get Perfectly Filled PDF</h3>
              <p className="text-gray-600">Claude + Grok fill every field, sign W-9, attach certs. Download instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — keep your Stripe cards but re-using the same code */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Simple, Pay-Per-Packet Pricing</h2>
          <p className="text-xl text-gray-600 mb-12">No subscription. Only pay when you win a new contract.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Standard</h3>
              <p className="text-5xl font-bold mb-6">$79<span className="text-lg font-normal text-gray-600">/packet</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li>Up to 30 pages</li>
                <li>W-9 auto-fill & sign</li>
                <li>Insurance certs attached</li>
              </ul>
              <Button className="w-full" size="lg" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
            <div className="border-2 border-blue-600 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-5xl font-bold mb-6">$129<span className="text-lg font-normal text-gray-600">/packet</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li>Up to 75 pages</li>
                <li>Everything in Standard</li>
                <li>Diversity certs auto-attached</li>
                <li>ESG answers included</li>
              </ul>
              <Button className="w-full" size="lg" variant="default" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
            <div className="border-2 border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-5xl font-bold mb-6">$199<span className="text-lg font-normal text-gray-600">/packet</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li>Unlimited pages</li>
                <li>Government & hospital packets</li>
                <li>Priority AI processing</li>
                <li>Audit trail PDF</li>
              </ul>
              <Button className="w-full" size="lg" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-12 mb-6">Ready to Save 10+ Hours Per Vendor?</h2>
          <p className="text-xl mb-8">Join 200+ suppliers already using VendorFill AI</p>
          <Button size="lg" variant="secondary" className="text-lg px-10">
            <Link href="/login">Start Filling Packets Now →</Link>
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t text-center text-sm text-gray-600">
        © 2025 VendorFill AI — All rights reserved
      </footer>
    </div>
  )
}
