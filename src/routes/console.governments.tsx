import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/governments")({
  head: () => ({ meta: [{ title: "Government / Public Sector — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader title="Government / Public-Sector Domain View" subtitle="Public-sector entities served through scoped institutional, compliance, and proof surfaces." readiness="FUTURE" />
      <ScopeBoundaryBanner>
        Government and public-sector entities are Foundation-supported actors served through scoped
        institutional, compliance, governance, and proof surfaces powered by the Foundation. They
        do not receive uncontrolled substrate-wide Console access.
      </ScopeBoundaryBanner>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DomainReadinessCard title="Institutional Portals" description="Scoped portals for credentialed institutions." readiness="FUTURE" />
        <DomainReadinessCard title="Compliance Surfaces" description="Lawful-basis, retention, and disclosure surfaces." readiness="FUTURE" />
        <DomainReadinessCard title="Proof Channels" description="Scoped proof channels for audit and regulator review." readiness="FUTURE" />
        <DomainReadinessCard title="Governance Reviews" description="Scoped governance review workflows." readiness="FUTURE" />
      </div>
    </div>
  ),
});
