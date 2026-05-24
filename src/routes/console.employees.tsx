import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, EcosystemDomainPage } from "@/components/console";

export const Route = createFileRoute("/console/employees")({
  head: () => ({ meta: [{ title: "Employees — NIOV Foundation Console" }] }),
  component: () => (
    <EcosystemDomainPage
      domainId="employees"
      title="Employees / Enterprise Workforce"
      subtitle="Workforce served through enterprise applications and AI teammates."
      readiness="FUTURE"
      entityType="employee"
      scopeBoundary="Employees are Foundation-supported actors served through enterprise applications, AI teammates, organization workflows, and scoped work experiences powered by the Foundation. They do not receive substrate-wide Foundation Console access."
      reports={[]}
      overview={
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <DomainReadinessCard
            title="AI Teammates"
            description="Employee-facing AI teammates inside enterprise applications."
            readiness="FUTURE"
          />
          <DomainReadinessCard
            title="Workforce Policies"
            description="Org-scoped policies governing employee work surfaces."
            readiness="FUTURE"
          />
          <DomainReadinessCard
            title="Workforce Wallets"
            description="Scoped work wallets and capability assignment."
            readiness="FUTURE"
          />
          <DomainReadinessCard
            title="Departures / Offboarding"
            description="Scoped lifecycle for employee offboarding."
            readiness="FUTURE"
          />
        </div>
      }
      sourceMappingEntries={[
        { label: "entities (employee)", value: "/api/v1/console/entities?entity_type=employee" },
      ]}
    />
  ),
});
