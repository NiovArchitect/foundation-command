import { createFileRoute } from "@tanstack/react-router";
import { DomainReadinessCard, EcosystemDomainPage } from "@/components/console";

export const Route = createFileRoute("/console/proof")({
  head: () => ({ meta: [{ title: "Regulator Proof Surfaces — NIOV Foundation Console" }] }),
  component: () => (
    <EcosystemDomainPage
      breadcrumbGroup="Data, Proof & Intelligence"
      meaning={{
        layer: "Future",
        body: "Verification and provenance layer for scoped regulator and auditor disclosure.",
        bullets: [
          "Proof surfaces are FUTURE in P0 — scoped disclosure, not full Console access.",
          "Backed by audit-chain evidence where available.",
        ],
      }}
      title="Regulator / Proof Surfaces"
      subtitle="Scoped proof surfaces for regulator and auditor disclosure."
      readiness="FUTURE"
      scopeBoundary="Regulator proof surfaces are scoped and future, not full Console access. Regulators and auditors are Foundation-supported actors served through scoped proof/compliance portals rather than substrate-wide Console access."
      reports={[
        { id: "regulator_proof", label: "Regulator Proof Surface Report", readiness: "FUTURE" },
      ]}
      overview={
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <DomainReadinessCard
            title="Disclosure Bundles"
            description="Scoped, signed proof bundles for regulator review. Not implemented in P0."
            readiness="FUTURE"
          />
          <DomainReadinessCard
            title="Auditor Read Channel"
            description="Audit-chain-backed read channel for credentialed auditors. Future."
            readiness="FUTURE"
          />
          <DomainReadinessCard
            title="Lawful-Basis Index"
            description="Index of lawful-basis events available for scoped disclosure. Partial backing."
            readiness="PARTIAL"
          />
          <DomainReadinessCard
            title="Government Proof Portal"
            description="Scoped institutional proof surfaces for public-sector entities. Future."
            readiness="FUTURE"
          />
        </div>
      }
      sourceMappingEntries={[
        {
          label: "audit (REGULATOR_ACCESS)",
          value: "/api/v1/console/audit?event_type=REGULATOR_ACCESS",
        },
        { label: "disclosure bundles", value: "proposed", tone: "warn" },
      ]}
    />
  ),
});
