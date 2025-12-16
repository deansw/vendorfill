import PageShell from "@/components/PageShell"
import PrimaryCtaLink from "@/components/PrimaryCtaLink"

export default function Dashboard() {
  return (
    <PageShell title="Welcome back!">
      <PrimaryCtaLink href="/upload">Upload New Packet →</PrimaryCtaLink>

      <p style={{ marginTop: "48px", fontSize: "22px", color: "#64748b" }}>
        No packets yet — upload your first one above!
      </p>
    </PageShell>
  )
}

