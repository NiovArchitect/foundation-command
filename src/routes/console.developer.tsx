import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, EcosystemDomainPage } from "@/components/console";

export const Route = createFileRoute("/console/developer")({
  head: () => ({ meta: [{ title: "Developer Integrations — NIOV Foundation Console" }] }),
  component: () => (
    <EcosystemDomainPage
      title="Developer & Integration Center"
      subtitle="Developer-scoped portal surfaces, APIs, SDKs, sandboxes."
      readiness="PARTIAL"
      scopeBoundary="Developers are Foundation-supported actors served through scoped developer portals, APIs, SDKs, and sandboxes — not full substrate-wide Console access."
      reports={[
        { id: "developer_api_usage", label: "Developer / API Usage Report", readiness: "PARTIAL" },
      ]}
      overview={
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <DomainReadinessCard title="Developer Portal" description="Scoped developer portal for API keys, sandboxes, and quotas." readiness="PARTIAL" capabilities={["scoped_api_key", "sandbox", "quota"]} />
          <DomainReadinessCard title="SDKs" description="First-party SDKs for governed memory and capsule operations." readiness="FUTURE" />
          <DomainReadinessCard title="Webhooks" description="Developer-scoped webhook delivery and verification." readiness="FUTURE" />
          <DomainReadinessCard title="Usage & Quotas" description="Per-developer API usage and quota posture." readiness="PARTIAL" />
        </div>
      }
      sourceMappingEntries={[
        { label: "gateway operations", value: "/api/v1/console/gateway", tone: "warn" },
        { label: "developer portal", value: "proposed: scoped portal", tone: "warn" },
      ]}
    />
  ),
});
