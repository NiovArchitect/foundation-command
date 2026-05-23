import { createFileRoute, Link } from "@tanstack/react-router";
import { DomainReadinessCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/organizations")({
  head: () => ({ meta: [{ title: "Organizations — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader title="Organization / Enterprise Console View" subtitle="Org-scoped activity rollups. ORG_SCOPED audience." readiness="PARTIAL" />
      <ScopeBoundaryBanner>
        Enterprises and org users are Foundation-supported actors served through scoped
        organization surfaces, not substrate-wide Console access.
      </ScopeBoundaryBanner>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <DomainReadinessCard title="Org Admin Surface" description="Scoped admin surface for organization-level governance." readiness="PARTIAL" capabilities={["can_admin_org"]} />
        <DomainReadinessCard title="Workforce Posture" description="Employee/workforce posture inside an organization scope." readiness="PARTIAL" />
        <DomainReadinessCard title="Org Capsule Policies" description="Org-scoped capsule policies and sharing rules." readiness="FUTURE" />
        <DomainReadinessCard title="Org Compliance" description="Org-level lawful-basis and consent posture." readiness="PARTIAL" />
      </div>
      <Link to="/console/reports/$report_id" params={{ report_id: "org_activity" }} className="self-start rounded-sm border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-2">
        Open Enterprise / Organization Activity Report →
      </Link>
    </div>
  ),
});
