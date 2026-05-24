import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, EcosystemDomainPage } from "@/components/console";

export const Route = createFileRoute("/console/organizations")({
  head: () => ({ meta: [{ title: "Organizations — NIOV Foundation Console" }] }),
  component: () => (
    <EcosystemDomainPage
      domainId="organizations"
      title="Organizations / Enterprises"
      subtitle="Org-scoped activity rollups served via scoped enterprise admin surfaces."
      readiness="PARTIAL"
      entityType="organization"
      scopeBoundary="Enterprises and org admins are Foundation-supported actors served through scoped organization surfaces, not substrate-wide Console access."
      reports={[
        { id: "org_activity", label: "Enterprise / Organization Activity", readiness: "PARTIAL" },
        { id: "compliance_disclosure", label: "Org Compliance Posture", readiness: "PARTIAL" },
      ]}
      overview={
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <DomainReadinessCard
            title="Org Admin Surface"
            description="Scoped admin surface for organization-level governance."
            readiness="PARTIAL"
            capabilities={["can_admin_org"]}
          />
          <DomainReadinessCard
            title="Workforce Posture"
            description="Employee/workforce posture inside an organization scope."
            readiness="PARTIAL"
          />
          <DomainReadinessCard
            title="Org Capsule Policies"
            description="Org-scoped capsule policies and sharing rules."
            readiness="FUTURE"
          />
          <DomainReadinessCard
            title="Org Compliance"
            description="Org-level lawful-basis and consent posture."
            readiness="PARTIAL"
          />
        </div>
      }
      sourceMappingEntries={[
        {
          label: "entities (organization)",
          value: "/api/v1/console/entities?entity_type=organization",
        },
        { label: "audit (ADMIN_ACTION)", value: "/api/v1/console/audit?event_type=ADMIN_ACTION" },
        {
          label: "compliance posture",
          value: "proposed: /api/v1/console/compliance",
          tone: "warn",
        },
      ]}
    />
  ),
});
