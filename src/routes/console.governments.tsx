import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, EcosystemDomainPage } from "@/components/console";

export const Route = createFileRoute("/console/governments")({
  head: () => ({ meta: [{ title: "Government / Public Sector — NIOV Foundation Console" }] }),
  component: () => (
    <EcosystemDomainPage
      domainId="governments"
      title="Government / Public Sector"
      subtitle="Public-sector entities served through scoped institutional, compliance, and proof surfaces."
      readiness="FUTURE"
      entityType="institution"
      scopeBoundary="Government and public-sector entities are Foundation-supported actors served through scoped institutional, compliance, governance, and proof surfaces powered by the Foundation. They do not receive uncontrolled substrate-wide Console access."
      reports={[{ id: "regulator_proof", label: "Regulator Proof Surface", readiness: "FUTURE" }]}
      overview={
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <DomainReadinessCard
            title="Institutional Portals"
            description="Scoped portals for credentialed institutions."
            readiness="FUTURE"
          />
          <DomainReadinessCard
            title="Compliance Surfaces"
            description="Lawful-basis, retention, and disclosure surfaces."
            readiness="FUTURE"
          />
          <DomainReadinessCard
            title="Proof Channels"
            description="Scoped proof channels for audit and regulator review."
            readiness="FUTURE"
          />
          <DomainReadinessCard
            title="Governance Reviews"
            description="Scoped governance review workflows."
            readiness="FUTURE"
          />
        </div>
      }
      sourceMappingEntries={[
        {
          label: "entities (institution)",
          value: "/api/v1/console/entities?entity_type=institution",
        },
        { label: "regulator proof surfaces", value: "proposed", tone: "warn" },
      ]}
    />
  ),
});
