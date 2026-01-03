import AppNav from "@/app/components/AppNav"

export default function BillingPage() {
  const plans = [
    { name: "Starter", docs: "5 documents / month", price: "$19.99" },
    { name: "Pro", docs: "25 documents / month", price: "$49.99" },
    { name: "Business", docs: "75 documents / month", price: "$139.99" },
    { name: "Unlimited", docs: "Unlimited documents / month", price: "$279.99" },
  ]

  return (
    <>
      <AppNav />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
          paddingTop: 140,
          paddingBottom: 80,
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h1 style={{ fontSize: 52, fontWeight: 950, color: "#0f172a", textAlign: "center" }}>
            Upgrade Your Plan
          </h1>
          <p style={{ marginTop: 14, textAlign: "center", color: "#64748b", fontSize: 18, fontWeight: 700 }}>
            Choose a subscription to unlock more uploads.
          </p>

          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 16,
            }}
          >
            {plans.map((p) => (
              <div
                key={p.name}
                style={{
                  background: "white",
                  borderRadius: 22,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
                  padding: 18,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>{p.name}</div>
                <div style={{ marginTop: 6, fontWeight: 800, color: "#334155" }}>{p.docs}</div>
                <div style={{ marginTop: 10, fontSize: 24, fontWeight: 950, color: "#2563eb" }}>{p.price}</div>

                <a
                  href="#"
                  style={{
                    display: "inline-block",
                    marginTop: 14,
                    width: "100%",
                    textAlign: "center",
                    padding: "12px 14px",
                    borderRadius: 14,
                    textDecoration: "none",
                    fontWeight: 950,
                    color: "white",
                    background: "linear-gradient(to right, #2563eb, #3b82f6)",
                    boxShadow: "0 10px 26px rgba(59, 130, 246, 0.25)",
                  }}
                >
                  Subscribe (Stripe next) →
                </a>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22, textAlign: "center", color: "#64748b", fontWeight: 700 }}>
            Next step: connect Stripe so these buttons start checkout and unlock uploads automatically.
          </div>
        </div>
      </div>
    </>
  )
}
