import Link from "next/link"

export default function Home() {
  const tiers = [
    { name: "Standard", price: "$79", desc: "Up to 30 pages", features: ["W-9 auto-signed", "Insurance attached"] },
    { name: "Pro", price: "$129", desc: "Up to 75 pages · Most Popular", features: ["Diversity certs", "ESG answers", "Priority AI"], popular: true },
    { name: "Enterprise", price: "$199", desc: "Unlimited pages", features: ["Government forms", "Audit trail PDF", "SLA"] },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8f9fa, #ffffff', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111827', lineHeight: 1.6 }}>
      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid #e5e7eb', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
              VF
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>VendorFill AI</span>
          </Link>
          <button style={{ background: '#2563eb', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 'semibold', fontSize: '1rem', cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>Get Started →</Link>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ paddingTop: '8rem', paddingBottom: '6rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <h1 style={{ fontSize: '3.75rem', fontWeight: 'black', lineHeight: 1.1, color: '#111827', marginBottom: '1.5rem' }}>
            Never Fill Out Another<br />Vendor Form Manually
          </h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', color: '#4b5563', marginBottom: '2rem' }}>
            Upload any supplier packet — get back a perfectly filled + signed PDF in under 10 minutes.
          </p>
          <button style={{ background: '#2563eb', color: 'white', padding: '1rem 3rem', borderRadius: '0.5rem', fontWeight: 'semibold', fontSize: '1.125rem', cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}>
            <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>Start Free →</Link>
          </button>
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.875rem', color: '#4b5563' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ No credit card</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: '#f9fafb', padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '3rem' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { title: "Build Your Profile Once", desc: "Company info, tax ID, bank, insurance — saved forever." },
              { title: "Upload Any Packet", desc: "Walmart, Boeing, Amazon, hospitals, government — we handle them all." },
              { title: "Get Filled PDF Instantly", desc: "Claude + Grok fill every field. Download or email." },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', width: '5rem', borderRadius: '50%', background: '#dbeafe', fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ fontSize: '1rem', color: '#4b5563' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Pay-Per-Packet Pricing</h2>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '3rem' }}>No subscription. Only pay when you win a contract.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {tiers.map((tier) => (
              <div key={tier.name} style={{ background: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: tier.popular ? '2px solid #2563eb' : '1px solid #e5e7eb', position: 'relative' }}>
                {tier.popular && (
                  <div style={{ position: 'absolute', top: '-1rem', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 'medium' }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>{tier.name}</h3>
                <p style={{ fontSize: '3rem', fontWeight: 'black', color: '#111827', marginBottom: '0.5rem' }}>
                  {tier.price}<span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#4b5563' }}>/packet</span>
                </p>
                <p style={{ color: '#4b5563', marginBottom: '2rem' }}>{tier.desc}</p>
                <ul style={{ listStyle: 'none', textAlign: 'left' }}>
                  {tier.features.map((f) => (
                   <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5.707 7.707l-6 6a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L9 11.586l5.293-5.293a1 1 0 1 1 1.414 1.414z" fill="#22c55e" />
                     </svg>
                     <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button style={{ background: '#2563eb', color: 'white', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'medium', fontSize: '1.125rem', cursor: 'pointer', border: 'none', width: '100%', transition: 'background 0.2s' }}>
                  <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>Get Started</Link>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#2563eb', padding: '6rem 1.5rem', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Ready to Save 10+ Hours Per Vendor?</h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Join hundreds of suppliers already using VendorFill AI</p>
          <button style={{ background: 'white', color: '#2563eb', padding: '1rem 3rem', borderRadius: '0.5rem', fontWeight: 'medium', fontSize: '1.125rem', cursor: 'pointer', border: 'none', transition: 'background 0.2s' }}>
            <Link href="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>Start Filling Packets Now →</Link>
          </button>
        </div>
      </section>

      <footer style={{ background: '#f9fafb', padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563', borderTop: '1px solid #e5e7eb' }}>
        © 2025 VendorFill AI — All rights reserved
      </footer>
    </div>
  )
}
