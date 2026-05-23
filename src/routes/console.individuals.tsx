import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, EcosystemDomainPage } from "@/components/console";

export const Route = createFileRoute("/console/individuals")({
  head: () => ({ meta: [{ title: "Individuals — NIOV Foundation Console" }] }),
  component: () => (
    <EcosystemDomainPage
      title="Individuals"
      subtitle="Foundation-supported individuals served through wallets and applications."
      readiness="FUTURE"
      entityType="individual"
      scopeBoundary="Individuals are Foundation-supported actors served through wallets, consent controls, memory experiences, and application-side products powered by the Foundation. They do not receive substrate-wide Foundation Console access."
      reports={[
        { id: "consent_posture", label: "Consent Posture", readiness: "FUTURE" },
      ]}
      overview={
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <DomainReadinessCard title="Personal Wallets" description="Individual wallet and identity surfaces." readiness="FUTURE" />
          <DomainReadinessCard title="Consent Controls" description="Granular consent over capsules and sharing." readiness="FUTURE" />
          <DomainReadinessCard title="Memory Experiences" description="Application-side experiences on top of governed memory." readiness="FUTURE" />
          <DomainReadinessCard title="Revocation Surfaces" description="Revocation of permissions across scopes." readiness="FUTURE" />
        </div>
      }
      sourceMappingEntries={[
        { label: "entities (individual)", value: "/api/v1/console/entities?entity_type=individual" },
        { label: "consent / wallet surfaces", value: "proposed: application-side", tone: "warn" },
      ]}
    />
  ),
});
