import { createFileRoute, Link } from "@tanstack/react-router";
import { DomainReadinessCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/developer")({
  head: () => ({ meta: [{ title: "Developer Integrations — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader title="Developer & Integration Center" subtitle="Developer-scoped portal surfaces, APIs, SDKs, sandboxes." readiness="PARTIAL" />
      <ScopeBoundaryBanner>
        Developers are Foundation-supported actors served through scoped developer portals, APIs,
        SDKs, and sandboxes — not full substrate-wide Console access.
      </ScopeBoundaryBanner>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <DomainReadinessCard title="Developer Portal" description="Scoped developer portal for API keys, sandboxes, and quotas." readiness="PARTIAL" capabilities={["scoped_api_key", "sandbox", "quota"]} />
        <DomainReadinessCard title="SDKs" description="First-party SDKs for governed memory and capsule operations." readiness="FUTURE" />
        <DomainReadinessCard title="Webhooks" description="Developer-scoped webhook delivery and verification." readiness="FUTURE" />
        <DomainReadinessCard title="Usage & Quotas" description="Per-developer API usage and quota posture." readiness="PARTIAL" />
      </div>
      <Link to="/console/reports/$report_id" params={{ report_id: "developer_api_usage" }} className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2">
        Open Developer / API Usage Report →
      </Link>
    </div>
  ),
});
