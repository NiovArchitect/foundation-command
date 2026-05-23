import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, PageHeader, ScopeBoundaryBanner } from "@/components/console";

export const Route = createFileRoute("/console/employees")({
  head: () => ({ meta: [{ title: "Employees — NIOV Foundation Console" }] }),
  component: () => (
    <div className="flex flex-col gap-5">
      <PageHeader title="Employee / Enterprise Workforce Domain View" subtitle="Workforce served through enterprise applications and AI teammates." readiness="FUTURE" />
      <ScopeBoundaryBanner>
        Employees are Foundation-supported actors served through enterprise applications, AI
        teammates, organization workflows, and scoped work experiences powered by the Foundation.
        They do not receive substrate-wide Foundation Console access.
      </ScopeBoundaryBanner>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DomainReadinessCard title="AI Teammates" description="Employee-facing AI teammates inside enterprise applications." readiness="FUTURE" />
        <DomainReadinessCard title="Workforce Policies" description="Org-scoped policies governing employee work surfaces." readiness="FUTURE" />
        <DomainReadinessCard title="Workforce Wallets" description="Scoped work wallets and capability assignment." readiness="FUTURE" />
        <DomainReadinessCard title="Departures / Offboarding" description="Scoped lifecycle for employee offboarding." readiness="FUTURE" />
      </div>
    </div>
  ),
});
